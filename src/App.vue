<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import { useQuasar } from 'quasar'
import { computed, defineComponent } from 'vue'
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser'

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
    // let intervalId
    // let serverVersion

    // Determina el layout basado en el estado de autenticación
    const { autenticado } = userIsAuthenticated()
    const layout = computed(() => {
      return autenticado ? 'PostulanteLayout' : 'FullLayout'
    })

    // calling here; equivalent to when component is created
    $q.dark.set(false)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(process.env.SERVICE_WORKER_FILE)
        // .then(registration =>
        //   console.log('Service Worker registrado con éxito:', registration)
        // )
        .catch(error =>
          console.log('App.vue: Error al registrar el Service Worker:', error)
        )
    }

    /*const checkVersion = () => {
      serverVersion = process.env.APP_VERSION || import.meta.env.APP_VERSION
      const currentVersion = LocalStorage.getItem('app_version')

      if (!currentVersion) LocalStorage.setItem('app_version', serverVersion)
      else if (currentVersion !== serverVersion) {
        showUpdateNotification()
      }
    }*/

    /*function showUpdateNotification() {
      Notify.create({
        message: 'Nueva versión disponible. Recarga para actualizar. 🚀 ',
        type: 'info',
        position: 'top',
        timeout: 0,
        color: 'gray-5',
        textColor: 'white',
        icon: 'system_update',
        classes: 'update-notification',
        actions: [
          {
            label: 'Recargar',
            color: 'accent',
            icon: 'refresh',
            handler: () => {
              LocalStorage.setItem('app_version', serverVersion)
              window.location.reload(true)
            }
          },
          {
            icon: 'close',
            color: 'red',
            round: true,
            handler: () => {
                /!** *!/
            }
          }
        ]
      })
    }*/

    /*onMounted(() => {
      // console.log('Component mounted.', process.env.APP_VERSION)
      checkVersion()
      //Revisar versión cada 5 minutos
      intervalId = setInterval(checkVersion, 1000 * 60 * 5)
    })
    onUnmounted(() => {
      clearInterval(intervalId)
    })*/

    return {
      layout
    }
  }
})
</script>
