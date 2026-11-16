// Funciona sin conexión y se actualiza sola: con internet pide siempre la versión nueva y la guarda;
// sin internet usa la última guardada.
const CACHE = 'mi-koala';
const ARCHIVOS = [
  './', 'index.html', 'manifest.webmanifest', 'css/estilo.css',
  'js/estado.js', 'js/koala.js', 'js/casa.js', 'js/juegos.js', 'js/mates.js',
  'js/rio.js', 'js/salto.js', 'js/tienda.js', 'js/app.js',
  'js/fiesta.js', 'js/minijuegos1.js', 'js/minijuegos2.js', 'js/acertijos.js',
  'iconos/icono-192.png', 'iconos/icono-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const pedido = e.request;
  if (pedido.method !== 'GET' || new URL(pedido.url).origin !== location.origin) return;
  e.respondWith(
    fetch(pedido, { cache: 'no-cache' })
      .then((respuesta) => {
        if (respuesta.ok) {
          const copia = respuesta.clone();
          caches.open(CACHE).then((c) => c.put(pedido, copia));
        }
        return respuesta;
      })
      .catch(() => caches.match(pedido, { ignoreSearch: true }).then((guardado) => guardado || caches.match('index.html')))
  );
});
