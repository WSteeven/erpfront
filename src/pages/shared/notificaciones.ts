import { useQuasar } from 'quasar'

export function useNotificaciones() {
  const $q = useQuasar()

  function notificarCorrecto(mensaje: string) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'bi-check-circle-fill',
      message: 'Correcto',
      caption: mensaje,
      position: 'top-right',
    })
  }

  function notificarError(mensaje: string) {
    $q.notify({
      color: 'pink-6',
      textColor: 'white',
      icon: 'bi-x-lg',
      message: 'Error',
      caption: mensaje,
      position: 'top-right',
    })
  }

  function notificarAdvertencia(mensaje: string) {
    $q.notify({
      color: 'white',
      textColor: 'amber-6',
      icon: 'bi-x-lg',
      message: 'Advertencia',
      caption: mensaje,
      position: 'top-right',
    })
  }

  function confirmar(mensaje: string, callback: () => void) {
    $q.dialog({
      title: 'Confirmación',
      message: mensaje,
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
