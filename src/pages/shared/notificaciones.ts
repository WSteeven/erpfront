import { useQuasar } from 'quasar'

export function useNotificaciones() {
  const $q = useQuasar()

  function notificarCorrecto(mensaje: string) {
    $q.notify({
      color: 'white',
      textColor: 'green-4',
      icon: 'bi-check-circle-fill',
      message: mensaje,
      position: 'top-right',
    })
  }

  function notificarError(mensaje: string) {
    $q.notify({
      color: 'white',
      textColor: 'pink-6',
      icon: 'bi-x-lg',
      message: mensaje,
      position: 'top-right',
    })
  }

  function notificarAdvertencia(mensaje: string) {
    $q.notify({
      color: 'white',
      textColor: 'amber-6',
      icon: 'bi-x-lg',
      message: mensaje,
      position: 'top-right',
    })
  }

  return {
    notificarCorrecto,
    notificarError,
    notificarAdvertencia,
  }
}
