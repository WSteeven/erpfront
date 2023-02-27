import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesTrabajo } from './ComportamientoModalesTrabajo'
import { CambiarEstadoTrabajo } from './CambiarEstadoTrabajo'
import { useNotificaciones } from 'shared/notificaciones'
import { useTrabajoStore } from 'stores/trabajo'
import { estadosTrabajos } from 'config/utils'
import { Trabajo } from '../domain/Trabajo'
import { Ref } from 'vue'

export const useBotonesTablaTrabajo = (listado: Ref<Trabajo[]>, modales: ComportamientoModalesTrabajo) => {
  const trabajoStore = useTrabajoStore()

  const { confirmar, notificarCorrecto, prompt } = useNotificaciones()
  const cambiarEstadoTrabajo = new CambiarEstadoTrabajo()

  const botonFormulario: CustomActionTable = {
    titulo: 'Formulario',
    icono: 'bi-check2-square',
    color: 'indigo',
    visible: ({ entidad }) => [estadosTrabajos.EJECUTANDO, estadosTrabajos.REALIZADO, estadosTrabajos.PAUSADO, estadosTrabajos.FINALIZADO].includes(entidad.estado),
    accion: ({ entidad }) => {
      trabajoStore.idTrabajoSeleccionado = entidad.id
      modales.abrirModalEntidad('EmergenciasPage')
    }
  }

  const botonVerPausas: CustomActionTable = {
    titulo: 'Ver pausas',
    icono: 'bi-pause',
    color: 'blue-6',
    accion: ({ entidad }) => {
      trabajoStore.idTrabajoSeleccionado = entidad.id
      trabajoStore.codigoTrabajoSeleccionado = entidad.codigo_trabajo
      modales.abrirModalEntidad('PausasRealizadasPage')
    }
  }

  const botonFinalizar: CustomActionTable = {
    titulo: 'Finalizar',
    color: 'positive',
    icono: 'bi-check',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.REALIZADO,
    accion: ({ entidad, posicion }) => confirmar('¿Está seguro de marcar como finalizada la subtarea?', async () => {
      const { result } = await cambiarEstadoTrabajo.finalizar(entidad.id)
      entidad.estado = estadosTrabajos.FINALIZADO
      entidad.fecha_hora_finalizacion = result.fecha_hora_finalizacion
      entidad.dias_ocupados = result.dias_ocupados
      actualizarElemento(posicion, entidad)
      notificarCorrecto('Trabajo finalizada exitosamente!')
    }),
  }

  const botonAsignar: CustomActionTable = {
    titulo: 'Asignar',
    color: 'indigo',
    icono: 'bi-person-fill-check',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.CREADO,
    accion: ({ entidad, posicion }) => {
      confirmar('¿Está seguro de asignar la subtarea?', async () => {
        const { result } = await cambiarEstadoTrabajo.asignar(entidad.id)
        entidad.estado = estadosTrabajos.ASIGNADO
        entidad.fecha_hora_asignacion = result.fecha_hora_asignacion
        actualizarElemento(posicion, entidad)
        notificarCorrecto('Trabajo asignada exitosamente!')
      })
    },
  }

  const botonCancelar: CustomActionTable = {
    titulo: 'Cancelar',
    color: 'negative',
    icono: 'bi-x-circle-fill',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.SUSPENDIDO,
    accion: ({ entidad, posicion }) => confirmar(['¿Está seguro de cancelar definitivamente la subtarea?'], async () => {
      const config: CustomActionPrompt = {
        mensaje: 'Ingrese el motivo de la cancelación',
        accion: async (data) => {
          const { result } = await cambiarEstadoTrabajo.cancelar(entidad.id, data)
          entidad.estado = estadosTrabajos.CANCELADO
          entidad.fecha_hora_cancelacion = result.fecha_hora_cancelacion
          entidad.causa_cancelacion = result.causa_cancelacion
          notificarCorrecto('Trabajo cancelado exitosamente!')
          actualizarElemento(posicion, entidad)
        }
      }

      prompt(config)
    }),
  }

  const botonReagendar: CustomActionTable = {
    titulo: 'Reagendar',
    color: 'info',
    icono: 'bi-calendar-check',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.SUSPENDIDO,
    accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de reagendar la subtarea?', () => {
      const config: CustomActionPrompt = {
        mensaje: 'Ingrese la nueva fecha',
        tipo: 'date',
        accion: async (data) => {
          const { result } = await cambiarEstadoTrabajo.reagendar(entidad.id, data)
          entidad.estado = estadosTrabajos.CREADO
          entidad.fecha_hora_creacion = result.fecha_hora_creacion
          notificarCorrecto('Trabajo reagendado exitosamente!')
          actualizarElemento(posicion, entidad)
        }
      }

      prompt(config)
    }),
  }

  const botonSubirArchivos: CustomActionTable = {
    titulo: 'Archivos',
    color: 'yellow-9',
    icono: 'bi-folder-fill',
    visible: () => true,
    accion: async ({ entidad }) => {
      trabajoStore.idTrabajoSeleccionado = entidad.id
      trabajoStore.codigoTrabajoSeleccionado = entidad.codigo_trabajo
      modales.abrirModalEntidad('GestorArchivoTrabajo')
    }
  }

  function actualizarElemento(posicion: number, entidad: Trabajo): void {
    if (posicion >= 0) {
      listado.value.splice(posicion, 1, entidad)
      listado.value = [...listado.value]
    }
  }

  return {
    botonFormulario,
    botonSubirArchivos,
    botonCancelar,
    botonReagendar,
    botonAsignar,
    botonFinalizar,
    botonVerPausas,
  }
}
