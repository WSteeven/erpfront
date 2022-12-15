import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'

export function useNotificaciones() {
  const $q = useNotificacionStore().$q ?? useQuasar()

  function obtenerMensaje(mensaje: string | string[]): string {
    if (Array.isArray(mensaje)) return mensaje.join('<br/>')
    return mensaje
  }

  function notificarCorrecto(mensaje: string | string[]) {
    $q.notify({
      html: true,
      color: 'light-green-7',
      textColor: 'white',
      icon: 'bi-check-circle-fill',
      message: 'Correcto',
      caption: obtenerMensaje(mensaje),
      position: 'bottom',
    })
  }

  function notificarError(mensaje: string | string[]) {
    $q.notify({
      html: true,
      color: 'pink-6',
      textColor: 'white',
      icon: 'bi-question-diamond-fill',
      message: 'Error',
      caption: obtenerMensaje(mensaje),
      position: 'bottom',
    })
  }


  function notificarAdvertencia(mensaje: string | string[]) {
    $q.notify({
      html: true,
      color: 'amber-9',
      textColor: 'white',
      icon: 'bi-exclamation-triangle-fill',
      caption: obtenerMensaje(mensaje),
      message: 'Advertencia',
      position: 'bottom',
      closeBtn: false,
      progress: true,
      timeout: 2000,
      actions: [
        { label: 'X', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  }

  function confirmar(mensaje: string | string[], callback: () => void) {
    $q.dialog({
      html: true,
      title: 'Confirmación',
      message: obtenerMensaje(mensaje),
      cancel: true,
      persistent: true,
    })
      .onOk(() => {
        callback()
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
  }

  function prompt(mensaje: string,  callback: (data) => void, type?:string, defaultValue?) {
    $q.dialog({
      html: true,
      title: 'Confirmación',
      message: mensaje,
      prompt: {
        model: defaultValue,
        type: type, // optional
      },
      cancel: true,
      persistent: true,
    })
      .onOk((data) => {
        callback(data)
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
  }

  return {
    // Notificaciones
    notificarCorrecto,
    notificarError,
    notificarAdvertencia,
    // Confirmaciones
    confirmar,
    prompt,
  }
}