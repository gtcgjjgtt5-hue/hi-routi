/* 하이루티 HiRouti — 오프라인 껍데기 캐시 */
const CACHE = 'hirouti-v10';
const SHELL = [
  './',
  './index.html',
  './styles.css?v=3',
  './app.js?v=3',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/routi-128.png',
  './assets/cookie.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        const updating = keys.some((k) => k !== CACHE);
        return Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
          .then(() => ({ updating }));
      })
      .then((info) => self.clients.claim().then(() => info))
      .then((info) => {
        // 새 버전으로 갈아탈 때, 이미 열려 있는 화면은 한 번 새로 고침해서 바로 새 화면을 보게 한다.
        if (!info.updating) return;
        return self.clients.matchAll({ type: 'window' }).then((clients) => {
          clients.forEach((client) => {
            if (client.navigate) client.navigate(client.url).catch(() => {});
          });
        });
      })
  );
});

/* 네트워크 우선 · 끊겼을 때만 캐시 (새 배포가 바로 보이도록) */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // 사랑의 스튜디오(/love-studio/)는 이 캐시가 관여하지 않는다.
  // (예전 버전 캐시가 새 배포 화면을 가로막던 문제 방지)
  if (url.pathname.indexOf('/love-studio/') !== -1) return;

  event.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
