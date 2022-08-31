import { useQuasar } from 'quasar'

export function useNotificaciones() {
  const $q = useQuasar()

  function obtenerMensaje(mensaje: string | string[]): string {
    if (Array.isArray(mensaje)) return mensaje.join('<br/>')
    return mensaje
  }

  function notificarCorrecto(mensaje: string | string[]) {
    $q.notify({
      color: 'green-7',
      textColor: 'white',
      icon: 'bi-check-circle-fill',
      message: 'Correcto',
      caption: obtenerMensaje(mensaje),
      position: 'top-right',
    })
  }

  function notificarError(mensaje: string | string[]) {
    $q.notify({
      color: 'pink-6',
      textColor: 'white',
      icon: 'bi-question-diamond-fill',
      message: 'Error',
      caption: obtenerMensaje(mensaje),
      position: 'top-right',
    })
  }

  function notificarAdvertencia(mensaje: string | string[]) {
    $q.notify({
      color: 'amber-8',
      textColor: 'white',
      icon: 'bi-exclamation-triangle-fill',
      message: 'Advertencia',
      caption: obtenerMensaje(mensaje),
      position: 'top-right',
    })
  }

  function confirmar(mensaje: string | string[], callback: () => void) {
    $q.dialog({
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

  function prompt(mensaje: string, callback: (data) => void, defaultValue) {
    $q.dialog({
      title: 'Confirmación',
      message: mensaje,
      prompt: {
        model: defaultValue,
        type: 'text', // optional
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
