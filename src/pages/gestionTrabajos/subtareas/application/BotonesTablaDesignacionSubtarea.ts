import { DesignarSecretarioGrupoController } from '../infraestructure/DesignarSecretarioGrupoController'
import { isAxiosError, notificarMensajesError, quitarItemDeArray, stringToArray } from 'shared/utils'
import { DesignarLiderGrupoController } from '../infraestructure/DesignarLiderGrupoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones, rolesSistema } from 'config/utils'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { ComputedRef, ref, Ref } from 'vue'
import { EmpleadoGrupo } from '../domain/EmpleadoGrupo'

export const useBotonesTablaDesignacionSubtarea = (empleadosSeleccionados: Ref<Empleado[]>, data: ComputedRef) => {
  const refEmpleadosGrupo = ref()
  const empleadoGrupoQuitar = ref()
  const asignarLider = ref(false)
  const asignarSecretario = ref(false)

  const { accion, modo_asignacion_trabajo, grupo } = data.value

  const { notificarCorrecto, notificarAdvertencia, confirmar } = useNotificaciones()

  const quitarEmpleado: CustomActionTable = {
    titulo: 'Quitar',
    icono: 'bi-x',
    color: 'negative',
    visible: () => [acciones.editar, acciones.nuevo].includes(accion) && !cambiarResponsable.value,
    accion: ({ entidad, posicion }) => {
      confirmar('Este empleado no participará en la ejecución del trabajo. ¿Desea continuar?', () => {
        if (entidad.es_responsable) notificarAdvertencia('No olvides designar a otro responsable.')
        empleadosSeleccionados.value.splice(posicion, 1)
      })
      //empleadosSeleccionados.value = empleadosSeleccionados.value // Necesario porque es computado get - set
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

  /* const designarLider: CustomActionTable = {
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
  } */

  /***********************
   * Designar responsable
   ***********************/
  const cambiarResponsable = ref(false)
  const btnCambiarResponsable: CustomActionTable = {
    titulo: 'Designar responsable',
    icono: 'bi-arrow-left-right',
    color: 'positive',
    visible: () => false, //!cambiarResponsable.value && [acciones.editar, acciones.nuevo].includes(accion),
    accion: async () => cambiarResponsable.value = true
  }

  const btnConfirmarDesignarResponsable: CustomActionTable = {
    titulo: 'Aceptar',
    icono: 'bi-check-circle',
    color: 'positive',
    visible: () => cambiarResponsable.value,
    accion: async () => {
      refEmpleadosGrupo.value.seleccionar()
      cambiarResponsable.value = false
    }
  }

  const btnCancelarDesignacionResponsable: CustomActionTable = {
    titulo: 'Cancelar',
    icono: 'bi-x-circle',
    color: 'negative',
    visible: () => cambiarResponsable.value,
    accion: () => cambiarResponsable.value = false
  }

  async function entidadSeleccionadaResponsable(empleados: EmpleadoGrupo[]) {
    if (empleados.length) {

      const empleadoSeleccionado = empleados[0]
      empleadoSeleccionado.es_responsable = true
      const index = empleadosSeleccionados.value.findIndex((emp: EmpleadoGrupo) => emp.id === empleadoSeleccionado.id)

      empleadosSeleccionados.value = empleadosSeleccionados.value.map((empleado: EmpleadoGrupo) => {
        const empleadoGrupo = new EmpleadoGrupo()
        empleadoGrupo.hydrate(empleado)
        empleadoGrupo.es_responsable = false
        return empleadoGrupo
      })

      empleadosSeleccionados.value.splice(index, 1, empleadoSeleccionado)
      empleados = []
    }
  }

  /* async function entidadSeleccionada(empleadoSeleccionado: Empleado[]) {
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
  } */

  return {
    refEmpleadosGrupo,
    empleadoGrupoQuitar,
    entidadSeleccionadaResponsable,
    quitarEmpleado,
    // Designar responsable
    cambiarResponsable,
    btnCambiarResponsable,
    btnConfirmarDesignarResponsable,
    btnCancelarDesignacionResponsable,
    // cancelarDesignacion,
    // asignarLider,
    // asignarSecretario,
    // designarLider,
  }
}
