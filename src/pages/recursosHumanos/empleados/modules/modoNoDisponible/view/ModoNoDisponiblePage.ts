import { defineComponent, ref } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { obtenerFechaActual, ordenarLista } from 'shared/utils'
import { required, requiredIf } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoDelegado } from 'recursosHumanos/empleados/modules/modoNoDisponible/domain/EmpleadoDelegado'
import { EmpleadoDelegadoController } from 'recursosHumanos/empleados/modules/modoNoDisponible/infraestructure/EmpleadoDelegadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { EmpleadoRoleController } from 'recursosHumanos/empleados/infraestructure/EmpleadoRolesController'
import { rolesSistema } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { ButtonSubmits },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      EmpleadoDelegado,
      new EmpleadoDelegadoController()
    )
    const {
      entidad: empleado_delegado,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, editar, guardar } =
      mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()
    const {notificarInformacion} = useNotificaciones()
    const store = useAuthenticationStore()
    const inmediato = ref(true)
    // const cargando = new StatusEssentialLoading()
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoRoleController(),
          params: {
            roles: [
              rolesSistema.tecnico,
              rolesSistema.tecnico_lider,
              rolesSistema.empleado
            ],
            excluir: 1
          }
        }
      })
      empleados.value = listadosAuxiliares.empleados
      empleado_delegado.empleado = store.user.id
    })

    const reglas = {
      delegado: { required },
      fecha_hora_desde: { required: requiredIf(!inmediato.value) },
      fecha_hora_hasta: { required }
    }
    const v$ = useVuelidate(reglas, empleado_delegado)
    setValidador(v$.value)
    /**
     * HOOKS
     */
    onGuardado(() => {
      emit('guardado', { formulario: 'ModoNoDisponiblePage', valor: true })
      emit('cerrar-modal', false)
    })

    const cancelar = () => {
      emit('cerrar-modal', false)
      emit('guardado', { formulario: 'ModoNoDisponiblePage', valor: false })
    }
    function  checkTipoDelegacion(val){
      if(val){
        empleado_delegado.fecha_hora_desde = null
        notificarInformacion('El cambio de delegador comenzará a aplicarse inmediatamente.')
      }
      else notificarInformacion('El cambio de delegador empezaran a aplicarse a partir de la fecha y hora que se empieza a delegar')
    }
    return {
      v$,
      store,
      accion,
      inmediato,
      empleado_delegado,
      empleados,
      mask: 'YYYY-MM-DD HH:mm',
      // funciones
      editar,
      guardar,
      cancelar,
      filtrarEmpleados,
      ordenarLista,
      checkTipoDelegacion,
      dateOptions: date => {
        return date >= obtenerFechaActual('YYYY/MM/DD')
      }
    }
  }
})
