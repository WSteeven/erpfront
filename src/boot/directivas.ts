import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default ({ app }) => {
  app.directive('focus', {
    mounted: (el) => el.focus(),
    
  })
}
