import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { validarEmail } from './utils'

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

  function prompt2(mensaje: string, callback: (data) => void, defaultValue = '', type = 'text') {
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

  function prompt(config: CustomActionPrompt) {
    $q.dialog({
      html: true,
      title: config.titulo ?? 'Confirmación',
      message: config.mensaje,
      prompt: {
        model: config.defecto,
        type: config.tipo ?? 'text', // optional
        isValid: val => config.validacion ? config.validacion(val) : true, //val => val <= data.entidad.cantidad,
      },
      cancel: true,
      persistent: true,
    })
      .onOk((data) => {
        config.accion(data)
        console.log('dentro d not: ' + data)
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