/* ============================================================
   사랑의 스튜디오 — 저장소
   ------------------------------------------------------------
   같은 인터페이스를 가진 두 가지 구현:
   · firebase : FIREBASE_CONFIG 가 채워졌을 때 (진짜 실시간)
   · demo     : 설정이 비었을 때 (이 기기에서만, 탭 여러 개로 체험)
   ============================================================ */

const ROOT = 'studio'; // Realtime Database 안의 최상위 키
const LS_KEY = 'love-studio.demo.v2';

export async function createStore(opts = {}) {
  const cfg = (typeof window !== 'undefined' && window.FIREBASE_CONFIG) || {};
  // 주소에 ?demo=1 을 붙이면 Firebase 설정이 있어도 체험 모드로 엽니다.
  // (신청 페이지와 사회자 화면을 같은 기기에서 나란히 시험할 때 사용)
  let forceDemo = opts.demo === true;
  if (!forceDemo && typeof window !== 'undefined') {
    try {
      forceDemo = new URLSearchParams(window.location.search).has('demo');
    } catch (_) {
      forceDemo = false;
    }
  }
  if (!forceDemo && cfg && cfg.databaseURL) {
    try {
      return await firebaseStore(cfg);
    } catch (err) {
      console.error('[사랑의 스튜디오] Firebase 초기화 실패 → 체험 모드로 전환', err);
      const s = localStore();
      s.note = '파이어베이스 연결에 실패해 체험 모드로 열었어요';
      return s;
    }
  }
  const s = localStore();
  if (forceDemo) s.note = '주소의 ?demo=1 로 체험 모드로 열었어요';
  return s;
}

/* ---------------- 체험 모드 (localStorage) ---------------- */

function localStore() {
  let listeners = [];
  let bc = null;
  try {
    bc = new BroadcastChannel('love-studio-demo');
  } catch (_) {
    bc = null;
  }

  const read = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };

  const getPath = (path) => {
    const root = read();
    if (!root) return null;
    if (!path) return root;
    return path
      .split('/')
      .filter(Boolean)
      .reduce((obj, key) => (obj && typeof obj === 'object' ? obj[key] : undefined), root) ?? null;
  };

  const emit = () => {
    const copy = listeners.slice();
    copy.forEach((l) => {
      try {
        l.fn(getPath(l.path));
      } catch (err) {
        console.error(err);
      }
    });
  };

  const save = (data) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('저장 실패', err);
    }
    emit();
    if (bc) {
      try {
        bc.postMessage('sync');
      } catch (_) {}
    }
  };

  const setPath = (obj, path, value) => {
    const keys = path.split('/').filter(Boolean);
    if (!keys.length) return value === null || value === undefined ? {} : value;
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i += 1) {
      const k = keys[i];
      if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
    const last = keys[keys.length - 1];
    if (value === null || value === undefined) delete cur[last];
    else cur[last] = value;
    return obj;
  };

  const store = {
    mode: 'demo',
    note: '',
    subscribe(path, fn) {
      const entry = { path, fn, last: undefined };
      entry.fn = (value) => {
        let sig;
        try {
          sig = JSON.stringify(value === undefined ? null : value);
        } catch (_) {
          sig = String(Math.random());
        }
        if (sig === entry.last) return;
        entry.last = sig;
        fn(value);
      };
      listeners.push(entry);
      try {
        entry.fn(getPath(path));
      } catch (err) {
        console.error(err);
      }
      return () => {
        listeners = listeners.filter((l) => l !== entry);
      };
    },
    async get(path) {
      return getPath(path);
    },
    async set(path, value) {
      const data = read() || {};
      const next = path ? setPath(data, path, value) : value || {};
      save(next);
    },
    async update(path, patch) {
      const data = read() || {};
      const current = getPath(path);
      const merged = current && typeof current === 'object' ? { ...current } : {};
      Object.entries(patch || {}).forEach(([k, v]) => {
        if (v === null || v === undefined) delete merged[k];
        else merged[k] = v;
      });
      setPath(data, path, merged);
      save(data);
    },
    async push(path, value) {
      const key = `-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
      const data = read() || {};
      const current = getPath(path);
      const merged = current && typeof current === 'object' ? { ...current } : {};
      merged[key] = value;
      setPath(data, path, merged);
      save(data);
      return key;
    },
    async remove(path) {
      const data = read() || {};
      if (!path) {
        localStorage.removeItem(LS_KEY);
        emit();
        if (bc) {
          try {
            bc.postMessage('sync');
          } catch (_) {}
        }
        return;
      }
      setPath(data, path, null);
      save(data);
    },
    setupDisconnect() {
      /* 체험 모드에서는 필요 없음 */
    },
    markPresence(id) {
      return store.update('presence', { [id]: { at: Date.now() } });
    },
    hasData() {
      return !!read();
    },
  };

  const sync = () => emit();
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key === LS_KEY) sync();
  });
  if (bc) bc.onmessage = () => sync();

  return store;
}

/* ---------------- 실시간 모드 (Firebase RTDB) ---------------- */

async function firebaseStore(cfg) {
  const V = '10.12.2';
  const [appMod, dbMod] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-database.js`),
  ]);

  const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(cfg);
  const db = dbMod.getDatabase(app);
  const refOf = (path) => dbMod.ref(db, ROOT + (path ? `/${path}` : ''));

  const store = {
    mode: 'firebase',
    note: '',
    subscribe(path, fn) {
      return dbMod.onValue(
        refOf(path),
        (snap) => fn(snap.val()),
        (err) => console.error('[사랑의 스튜디오] 구독 오류', path, err)
      );
    },
    async get(path) {
      const snap = await dbMod.get(refOf(path));
      return snap.val();
    },
    async set(path, value) {
      await dbMod.set(refOf(path), value);
    },
    async update(path, patch) {
      await dbMod.update(refOf(path), patch);
    },
    async push(path, value) {
      const r = await dbMod.push(refOf(path), value);
      return r.key;
    },
    async remove(path) {
      await dbMod.remove(refOf(path));
    },
    setupDisconnect(id) {
      const mine = dbMod.ref(db, `${ROOT}/presence/${id}`);
      dbMod.onDisconnect(mine).remove();
    },
    async markPresence(id) {
      const mine = dbMod.ref(db, `${ROOT}/presence/${id}`);
      await dbMod.set(mine, { at: Date.now() });
    },
    hasData: () => true,
  };

  return store;
}

/* ---------------- 체험 모드 첫 화면용 샘플 ---------------- */

export function demoTemplate() {
  const now = Date.now();
  return {
    status: { round: 'r1', updatedAt: now },
    announcements: {
      a1: {
        text: '사랑의 스튜디오에 오신 걸 환영합니다 💘 사회자입니다. 편하게 인사 나눠 주세요!',
        at: now - 1000 * 60 * 12,
      },
    },
    lounge: {
      s1: {
        pid: 'w5',
        text: '안녕하세요 여자 5호예요 :) 잘 부탁드려요!',
        at: now - 1000 * 60 * 9,
      },
      s2: {
        pid: 'm6',
        text: '반갑습니다 남자 6호입니다. 대구에서 왔어요 ⚾',
        at: now - 1000 * 60 * 7,
      },
      s3: {
        pid: 'w9',
        text: '여자 9호예요~ 다들 어떤 음악 좋아하세요?',
        at: now - 1000 * 60 * 5,
      },
      s4: {
        pid: 'm2',
        text: '저는 90년대 발라드요. 이 무드에 딱이네요 ㅎㅎ',
        at: now - 1000 * 60 * 3,
      },
      s5: {
        pid: 'host',
        text: '📢 1부 · 자기소개 & 단체톡이 시작되었습니다',
        at: now - 1000 * 60 * 2,
        type: 'system',
      },
    },
    votes: {},
    presence: {},
    rooms: {},
    dm: {},
    roomChat: {},
    results: null,
  };
}
