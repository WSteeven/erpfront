<template>
  <router-view />
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
// import Echo from 'laravel-echo'
// import Pusher from 'pusher-js'
// import Pusher from 'pusher-js' // import Pusher

// window.Pusher = Pusher

export default defineComponent({
  name: 'App',
  setup() {
    /*channel.bind('SubtareaEvent', function (data) {
      console.log('Mensaje en tiempo real')
      console.log(data)
      // app.messages.push(JSON.stringify(data))
    }) */

    const $q = useQuasar()

    // calling here; equivalent to when component is created
    $q.dark.set(false)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(process.env.SERVICE_WORKER_FILE)
        .then((registration) =>
          console.log('Service Worker registrado con éxito:', registration)
        )
        .catch((error) =>
          console.log('Error al registrar el Service Worker:', error)
        )
    }

    return {
      //
    }
  },
  // mounted (){
  //   window.Echo = new Echo({
  //     broadcaster: 'pusher',
  //     key: 'fZiFHdHn89NjzzxqN5p2',
  //     wsHost: window.location.hostname,
  //     wsPort: 6001,
  //     disableStats: true,
  //     forceTLS: false,
  //     enabledTransports: ['ws'],
  //   })
  //   window.Echo.channel('prueba').listen('NewMessagePruebaEvent', (e)=>{
  //     console.log('Llegó algo: ', e.message)
  //   })
  // }
})
</script>
