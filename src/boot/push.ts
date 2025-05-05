import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'

export default async () => {
    if (Capacitor.isNativePlatform()) {
        await PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                PushNotifications.register()
            }
        })

        PushNotifications.addListener('registration', token => {
            console.log('Push registration success, token:', token.value)
            // Envía este token a tu servidor
        })

        PushNotifications.addListener('registrationError', err => {
            console.error('Push registration error:', err)
        })

        PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push received: ', notification)
        })

        PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log('Push action performed', notification)
        })
    }
}
