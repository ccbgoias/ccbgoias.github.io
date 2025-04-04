if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/assets/js/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration)
      })
      .catch((error) => {
        console.error('Falha ao registrar o Service Worker:', error)
      })
  })
}
