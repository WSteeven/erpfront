import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Planificador } from 'recursosHumanos/planificador/domain/Planificador'
import { PlanificadorController } from 'recursosHumanos/planificador/infraestructure/PlanificadorController'
import { useAuthenticationStore } from 'stores/authentication'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { tabOptionsPlanificiones } from 'config/recursosHumanos.utils'
import { configuracionColumnasPlanificaciones } from 'recursosHumanos/planificador/domain/configuracionColumnasPlanificaciones'
import { encontrarUltimoIdListado, ordenarLista } from 'shared/utils'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { Actividad } from 'recursosHumanos/planificador/domain/Actividad'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Planificador,
      new PlanificadorController()
    )
    const {
      entidad: planificador,
      listadosAuxiliares,
      accion,
      disabled
    } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()
    const { confirmar, prompt } = useNotificaciones()

    const store = useAuthenticationStore()

    const tabDefecto = ref('0')

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1, campos: 'id,nombres,apellidos' }
        }
      })

      empleados.value = listadosAuxiliares.empleados
      planificador.empleado = store.user.id
    })
    const reglas = {
      nombre: { required },
      empleado: { required }
    }
    const v$ = useVuelidate(reglas, planificador)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onReestablecer(() => (planificador.empleado = store.user.id))

    /*****************
     * Funciones
     ****************/
    async function filtrar(tab: string) {
      tabDefecto.value = tab
      switch (tab) {
        case '1':
          await listar({ completado: 100 })
          break
        default:
          await listar({
            'completado[operator]': '<',
            'completado[value]': 100
          })
      }
    }

    const agregarActividad = () => {
      const fila: Actividad = new Actividad()
      fila.id = planificador.actividades.length
        ? encontrarUltimoIdListado(planificador.actividades) + 1
        : 1
      const config: CustomActionPrompt = {
        titulo: 'Nombre',
        mensaje: 'Ingrese el nombre de la actividad',
        accion: (nombre) => {
          fila.nombre = nombre
          planificador.actividades.push(fila)
        }
      }
      prompt(config)
    }

    return {
      mixin,
      v$,
      accion,
      disabled,
      planificador,
      store,
      tabDefecto,
      configuracionColumnas: configuracionColumnasPlanificaciones,
      tabOptions: tabOptionsPlanificiones,

      //listados
      empleados,
      filtrarEmpleados,

      //funciones
      filtrar,
      ordenarLista,
      agregarActividad
    }
  }
})
