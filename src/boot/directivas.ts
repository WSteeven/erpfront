import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
const pusher = Pusher

declare global {
  interface Window { Pusher: any; Echo: any; }
}

window.Pusher = pusher

window.onload = function(){
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'fZiFHdHn89NjzzxqN5p2',
    wsHost: window.location.hostname,
    wsPort: 6001,
    disableStats: true,
    forceTLS: false,
    enabledTransports: ['ws'],
  })

  window.Echo.channel('prueba').listen('NewMessagePruebaEvent', (e) => {
    console.log('Llegó algo: ', e.message)
  })
}

export default ({ app }) => {
  app.directive('focus', {
    mounted: (el) => el.focus()
    /* window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'fZiFHdHn89NjzzxqN5p2',
      wsHost: window.location.hostname,
      wsPort: 6001,
      disableStats: true,
      forceTLS: false,
      enabledTransports: ['ws'],
    }) 
    window.Echo.channel('prueba').listen('NewMessagePruebaEvent', (e) => {
      console.log('Llegó algo: ', e.message)
    }) */
  })
}
