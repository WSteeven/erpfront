self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cache-name').then((cache) => {
      return cache.addAll([
        // Agrega aquí los archivos que deseas cachear
        // console.log('evento install en service worker')
      ])
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            //Logica para eliminar caches antiguos si es necesario
            // console.log('evento eliminar caches antiguos')
          })
          .map((cacheName) => {
            return caches.delete(cacheName)
          })
      )
    })
  )
})

self.addEventListener('push', (event) => {
  // Lógica para mostrar notificaciones push
  console.log('evento push de la notificacion')
  const options = {
    body: event.data.text(),
    icon: './src/assets/logo.png', // Ruta a un icono para la notificación
    badge: './src/assets/logo.png', // Ruta a un distintivo para la notificación
  }

  event.waitUntil(
    self.registration.showNotification('Titulo de la notificacion', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  // Lógica para manejar clics en notificaciones
  console.log('evento del click de notificacion')
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'notificacionPush') {
    console.log('Evento recibido:', event.data.data)

    const options = {
      body: event.data.mensaje,
      icon: event.data.icono ? event.data.icono : './src/assets/logo.png', // Ruta a un icono para la notificación
      badge: './src/assets/logo.png', // Ruta a un distintivo para la notificación
    }
    event.waitUntil(
      self.registration.showNotification(event.data.titulo, options)
    )
    // event.respondWith('Holaaaaaaaa ')
    const channel = new BroadcastChannel('mi-canal')
    channel.postMessage({
      evento: 'eventoPersonalizado',
      data: 'Evento recibido exitosamente',
    })
  }
})
