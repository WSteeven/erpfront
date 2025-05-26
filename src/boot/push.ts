import {PushNotifications}  from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'

export default async () => {
    if (Capacitor.isNativePlatform()) {
        await PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                PushNotifications.register()
            }
        })

        await PushNotifications.addListener('registration', token => {
            console.log('Push registration success, token:', token.value)
            // Envía este token a tu servidor
        })

        await PushNotifications.addListener('registrationError', err => {
            console.error('Push registration error:', err)
        })

        await PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push received: ', notification)
        })

        await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log('Push action performed', notification)
        })
    }
}
