import { DesignarSecretarioGrupoController } from '../infraestructure/DesignarSecretarioGrupoController'
import { isAxiosError, notificarMensajesError, quitarItemDeArray, stringToArray } from 'shared/utils'
import { DesignarLiderGrupoController } from '../infraestructure/DesignarLiderGrupoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones, rolesSistema } from 'config/utils'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { ComputedRef, ref, Ref } from 'vue'

export const useBotonesTablaDesignacionSubtarea = (empleadosSeleccionados: Ref<Empleado[]>, data: ComputedRef) => {
  const refEmpleadosGrupo = ref()
  const empleadoGrupoQuitar = ref()
  const asignarLider = ref(false)
  const asignarSecretario = ref(false)

  const { accion, modo_asignacion_trabajo, grupo } = data.value

  const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()

  const quitarEmpleado: CustomActionTable = {
    titulo: 'Quitar',
    icono: 'bi-x',
    color: 'negative',
    visible: () => [acciones.editar, acciones.nuevo].includes(accion) && !(asignarLider.value || asignarSecretario.value),
    accion: ({ entidad, posicion }) => {
      if (modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) {
        if (entidad.roles.includes(rolesSistema.tecnico_lider)) {
          asignarLider.value = true
          asignarSecretario.value = false
          empleadoGrupoQuitar.value = entidad
          return notificarAdvertencia('Debes asignar a un reemplazo para el líder a eliminar.')
        }
        if (entidad.roles.includes(rolesSistema.secretario)) {
          asignarLider.value = false
          asignarSecretario.value = true
          empleadoGrupoQuitar.value = entidad
          return notificarAdvertencia('Debes asignar a un reemplazo para el secretario a eliminar.')
        }
      }

      empleadosSeleccionados.value.splice(posicion, 1)
    },
  }

  /* const designarLiderTemporal: CustomActionTable = {
    titulo: 'Designar como líder de grupo para este trabajo',
    icono: 'bi-clock-history',
    color: 'accent',
    visible: () => asignarLider.value,
    accion: async ({ entidad }) => {
      console.log(data.value)
      refEmpleadosGrupo.value.seleccionar()
    },
  } */

  const designarLider: CustomActionTable = {
    titulo: 'Designar como líder de grupo',
    icono: 'bi-arrow-left-right',
    color: 'positive',
    visible: () => asignarLider.value,
    accion: async ({ entidad }) => {
      refEmpleadosGrupo.value.seleccionar()
    },
  }

  const cancelarDesignacion: CustomActionTable = {
    titulo: 'Cancelar',
    icono: 'bi-x',
    color: 'negative',
    visible: () => asignarLider.value || asignarSecretario.value,
    accion: () => {
      asignarLider.value = false
      asignarSecretario.value = false
    },
  }

  async function entidadSeleccionada(empleadoSeleccionado: Empleado[]) {
    if (empleadoSeleccionado.length) {
      const idEmpleadoSeleccionado = empleadoSeleccionado[0].id

      try {
        // Lider de grupo
        if (asignarLider.value) {
          const empleado = {
            id: idEmpleadoSeleccionado,
            grupo: grupo.value,
          }

          console.log(empleadoGrupoQuitar.value)
          const { response, result: nuevoLider } = await new DesignarLiderGrupoController().editar(empleado)
          asignarLider.value = false

          notificarCorrecto(response.data.mensaje)

          // Quitar rol de lider de grupo a antiguo lider
          const roles = stringToArray(empleadoGrupoQuitar.value.roles)
          empleadoGrupoQuitar.value.roles = quitarItemDeArray(roles, rolesSistema.tecnico_lider).join(',')

          // Designar rol lider de grupo al nuevo lider
          const posicionNuevoLider: any = empleadosSeleccionados.value.findIndex((empleado: Empleado) => empleado.id === idEmpleadoSeleccionado)
          empleadosSeleccionados.value.splice(posicionNuevoLider, 1, nuevoLider)
        }
      } catch (e) {
        if (isAxiosError(e)) {
          const mensajes: string[] = e.erroresValidacion
          notificarMensajesError(mensajes, useNotificaciones())
        }
      }
    }
  }

  return {
    refEmpleadosGrupo,
    empleadoGrupoQuitar,
    quitarEmpleado,
    entidadSeleccionada,
    cancelarDesignacion,
    asignarLider,
    asignarSecretario,
    designarLider,
  }
}
