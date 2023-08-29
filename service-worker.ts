self.addEventListener('install', (event: Event) => {
  event.waitUntil(
    caches.open('cache-name').then((cache) => {
      return cache.addAll([
        // Agrega aquí los archivos que deseas cachear
        // console.log('evento install en service worker')
      ]);
    })
  );
});

self.addEventListener('activate', (event: Event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Logica para eliminar caches antiguos si es necesario
            // console.log('evento eliminar caches antiguos')
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('push', (event) => {
  // Lógica para mostrar notificaciones push
  console.log('evento push de la notificacion');
  const options: NotificationOptions = {
    body: event.data?.text(),
    icon: './src/assets/logo.png', // Ruta a un icono para la notificación
    badge: '12', // Ruta a un distintivo para la notificación
  };

  event.waitUntil(
    self.registration.showNotification('Titulo de la notificacion', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  const url = event.notification.data.url;

  if (url) {
    event.waitUntil(
       clients.openWindow(url)
      )
  }

});


self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'notificacionPush') {
    console.log('Evento recibido:', event.data.mensaje);

    const options: NotificationOptions = {
      body: event.data.mensaje,
      icon: './src/assets/logo.png', // Ruta a un icono para la notificación
      vibrate: [200, 100, 200], 
      data: { url: event.data.link }, // Cambia event.data.link a la propiedad correcta que contiene la URL
    };

    self.registration.showNotification(event.data.titulo, options);
  }
});


// self.addEventListener('notificationclick', (event) => {
//   // Lógica para manejar clics en notificaciones
//   // const action = event.action
//   const url = event.notification.data.url;

//   if (url) {
//     event.waitUntil(
//       clients.openWindow(url)
//     );
//   }
//   // if(action === 'ver') console.log('Diste click en ver', event);
//   // else console.log('Otra acción del evento del click de notificacion', event);
// });

// self.addEventListener('message', (event: MessageEvent) => {
//   if (event.data && event.data.action === 'notificacionPush') {
//     console.log('Evento recibido:', event.data.mensaje);

//     const options: NotificationOptions = {
//       body: event.data.mensaje,
//       image:  './src/assets/logo.png', // Ruta a un icono para la notificación
//       // icon: './src/assets/icons/eye.png',
//       vibrate: [200, 100, 200], 
//       data: {url: event.data.link},
//     };
//     event.waitUntil(
//       self.registration.showNotification(event.data.titulo, options)
//     );
//     // event.respondWith('Holaaaaaaaa ');
//     const channel = new BroadcastChannel('mi-canal');
//     channel.postMessage({
//       evento: 'eventoPersonalizado',
//       data: 'Evento recibido exitosamente',
//     });
//   }
// });
