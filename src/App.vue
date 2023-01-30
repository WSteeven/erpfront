<template>
  <router-view />
</template>

<script>
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
