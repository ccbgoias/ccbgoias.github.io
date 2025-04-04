const CACHE_NAME = 'agenda-cache-v4'
const OFFLINE_PAGE = '/offline.html'
const STATIC_FILES = [
  OFFLINE_PAGE,
  '/css/styles.css',
  '/js/scripts.js',
  '/images/logo.png',
]

// Instalando o Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_FILES) // Pré-cache de arquivos estáticos
    })
  )
  self.skipWaiting() // Força a ativação imediata do SW
})

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim() // Garante que o SW controle as páginas abertas
})

// Intercepta requisições e armazena no cache automaticamente
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    // Requisições de navegação (páginas)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()) // Atualiza o cache
            return response
          })
        })
        .catch(() => {
          return caches.match(OFFLINE_PAGE) // Fallback para página offline
        })
    )
  } else {
    // Requisições de outros recursos (estáticos)
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response // Retorna do cache se existir
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone()) // Salva no cache
            return networkResponse
          })
        })
      })
    )
  }
})
