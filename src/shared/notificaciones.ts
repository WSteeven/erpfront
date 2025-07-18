import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'


export function useNotificaciones() {
  const $q = useNotificacionStore().$q ?? useQuasar()

  function obtenerMensaje(mensaje: string | string[]): string {
    if (Array.isArray(mensaje)) return mensaje.join('<br/>')
    return mensaje
  }

  const base = {
    html: true,
    textColor: $q?.dark.isActive ? 'white' : 'black',
    position: 'bottom',
    // multiLine: true,
    // progress: true,
    classes: 'rounded-tabpanel q-py-sm shadow-notification bg-desenfoque border-white',
  }

  function notificarInformacion(mensaje: string | string[]) {
    $q.notify({
      ...base,
      iconColor: 'light-blue-7',
      icon: 'bi-info-circle-fill',
      message: '<b>Información</b>',
      caption: obtenerMensaje(mensaje),
      progressClass: 'text-light-blue-7',
      actions: [
        { label: 'Cerrar', color: 'light-blue-7', handler: () => { /* ... */ } }
      ],
    })
  }

  function notificarCorrecto(mensaje: string | string[]) {
    $q.notify({
      ...base,
      iconColor: 'positive',
      icon: 'bi-check-circle-fill',
      message: '<b>Correcto</b>',
      caption: obtenerMensaje(mensaje),
      progressClass: 'text-positive',
      actions: [
        { label: 'Cerrar', color: 'positive', handler: () => { /* ... */ } }
      ],
    })
  }

  function notificarError(mensaje: string | string[]) {
    $q.notify({
      ...base,
      iconColor: 'pink-6',
      icon: 'bi-question-diamond-fill',
      message: '<b>Error</b>',
      caption: obtenerMensaje(mensaje),
      progressClass: 'text-pink-6',
      actions: [
        { label: 'Cerrar', color: 'pink-6', handler: () => { /* ... */ } }
      ],
    })
  }


  function notificarAdvertencia(mensaje: string | string[]) {
    $q.notify({
      ...base,
      iconColor: 'amber-9',
      icon: 'bi-exclamation-triangle-fill',
      message: '<b>Advertencia</b>',
      caption: obtenerMensaje(mensaje),
      progressClass: 'text-amber-9',
      actions: [
        { label: 'Cerrar', color: 'amber-9', handler: () => { /* ... */ } }
      ],
    })
  }

  function confirmar(mensaje: string | string[], callback: () => void, cancel?: () => void) {
    $q.dialog({
      html: true,
      title: 'Confirmación',
      message: obtenerMensaje(mensaje),
      cancel: true,
      persistent: true,
    })
      .onOk(async () => {
        await callback()
      })
      .onCancel(async () => {
        if (cancel) await cancel()
        // console.log('>>>> Cancel')
      })
  }

  function prompt(config: CustomActionPrompt) {
    $q.dialog({
      html: true,
      title: config.titulo ?? 'Confirmación',
      message: config.mensaje,
      prompt: {
        placeholder: config.placeholder ?? null,
        model: config.defecto,
        type: config.tipo ?? 'text', // optional
        isValid: val => config.validacion ? config.validacion(val) : true, //val => val <= data.entidad.cantidad,
      },
      cancel: !config.requerido,
      persistent: true,
    })
      .onOk((data) => {
        config.accion(config.tipo === 'number' ? parseInt(data) : data)
        // console.log('dentro d not: ' + data)
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
  }

  function promptItems(config: CustomActionPrompt) {
    $q.dialog({
      html: true,
      title: config.titulo ?? 'Confirmación',
      message: config.mensaje,
      cancel: true,
      persistent: true,
      options: {
        type: config.tipo,
        model: config.defecto,
        // inline: true
        items: config.items,
        isValid: val => config.hasOwnProperty('requerido') ? (!config.requerido || !!val) : (false || !!val),
      },
    })
      .onOk((data) => {
        config.accion(config.tipo === 'number' ? parseInt(data) : data)
        // console.log('dentro d not: ' + data)
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
  }

  return {
    // Notificaciones
    notificarInformacion,
    notificarCorrecto,
    notificarError,
    notificarAdvertencia,
    // Confirmaciones
    confirmar,
    prompt,
    promptItems,
  }
}
