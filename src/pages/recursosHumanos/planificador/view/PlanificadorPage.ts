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
import { opcionesSubactividadesPlanificador, tabOptionsPlanificiones } from 'config/recursosHumanos.utils'
import { configuracionColumnasPlanificaciones } from 'recursosHumanos/planificador/domain/configuracionColumnasPlanificaciones'
import { encontrarUltimoIdListado, ordenarLista } from 'shared/utils'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { Actividad } from 'recursosHumanos/planificador/domain/Actividad'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { configuracionColumnasSubactividades } from 'recursosHumanos/planificador/domain/configuracionColumnasSubactividades'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { acciones, accionesTabla } from 'config/utils'
import { Subactividad } from 'recursosHumanos/planificador/domain/Subactividad'
import { UnidadMedida } from 'pages/bodega/unidades_medidas/domain/UnidadMedida'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { event } from 'quasar'
import position = event.position

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
      // configuracionColumnasSubactividades.find((item)=> item.field==='estado')!.options = opcionesSubactividadesPlanificador
      configuracionColumnasSubactividades.find(
        item => item.field === 'empleado'
      )!.options = listadosAuxiliares.empleados.map((v: Empleado) => {
        return { value: v.id, label: v.nombres + ' ' + v.apellidos }
      })
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
        accion: nombre => {
          fila.nombre = nombre
          planificador.actividades.push(fila)
        }
      }
      prompt(config)
    }

    const editarNombreActividad = (actividad:Actividad)=>{
      console.log(actividad)
      const config: CustomActionPrompt = {
        titulo: 'Nombre',
        mensaje: 'Ingresa el nombre de la actividad',
        defecto: actividad.nombre,
        accion: (nombre)=>{
          actividad.nombre = nombre
        }
      }
      prompt(config)
    }
    const eliminarActividad = (posicion)=>{
      confirmar('¿Está seguro de eliminar la actividad? Está acción borrará todas las subactividades', ()=>
        planificador.actividades.splice(posicion,1)
      )
    }

    function eliminar({ posicion, identificador }) {
      confirmar('¿Está seguro de continuar?', () =>
        planificador.actividades[identificador].subactividades.splice(
          posicion,
          1
        )
      )
    }

    const btnAgregarSubactividad: CustomActionTable<Subactividad> = {
      titulo: 'Agregar Item',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar referencia personal o laboral',
      accion: identificador => {
        console.log(identificador)
        const fila = new Subactividad()
        fila.actividad_id = planificador.actividades[identificador].id
        fila.
        fila.id = planificador.actividades[identificador].subactividades.length
          ? encontrarUltimoIdListado(
              planificador.actividades[identificador].subactividades
            ) + 1
          : 1
        planificador.actividades[identificador].subactividades.push(fila)
      },
      visible: () => accion.value == acciones.nuevo
    }

    const btnEliminar: CustomActionTable<Subactividad> = {
      titulo: '',
      icono: 'bi-trash',
      color: 'negative',
      accion: ({ posicion, identificador }) => {
        eliminar({ posicion, identificador })
      },
      visible: () => true
    }

    return {
      mixin,
      v$,
      accion,
      acciones,
      accionesTabla,
      disabled,
      planificador,
      store,
      tabDefecto,
      configuracionColumnas: configuracionColumnasPlanificaciones,
      configuracionColumnasSubactividades,
      tabOptions: tabOptionsPlanificiones,

      //listados
      empleados,
      filtrarEmpleados,

      //funciones
      filtrar,
      ordenarLista,
      agregarActividad,
      eliminarActividad,
      editarNombreActividad,

      // botones de tabla
      btnEliminar,
      btnAgregarSubactividad
    }
  }
})
