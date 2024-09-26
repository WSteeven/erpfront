<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import { useQuasar } from 'quasar'
import { computed, defineComponent } from 'vue'
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser';

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

    // Determina el layout basado en el estado de autenticación
    const { autenticado } = userIsAuthenticated()
    const layout = computed(() => {
      return autenticado ? 'PostulanteLayout' : 'FullLayout'
    })

    // calling here; equivalent to when component is created
    $q.dark.set(false)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(import.meta.env.VITE_SERVICE_WORKER_FILE)
        .then(registration =>
          console.log('Service Worker registrado con éxito:', registration)
        )
        .catch(error =>
          console.log('Error al registrar el Service Worker:', error)
        )
    }

    return {
      layout
    }
  }
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
