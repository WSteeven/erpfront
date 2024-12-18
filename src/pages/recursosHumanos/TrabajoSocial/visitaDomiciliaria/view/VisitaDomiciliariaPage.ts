import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VisitaDomiciliaria } from 'trabajoSocial/visitaDomiciliaria/domain/VisitaDomiciliaria'
import { VisitaDomiciliariaController } from 'trabajoSocial/visitaDomiciliaria/infraestructure/VisitaDomiciliariaController'
import { required, requiredIf } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { configuracionColumnasVisitaDomiciliaria } from 'trabajoSocial/visitaDomiciliaria/domain/configuracionColumnasVisitaDomiciliaria'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import ComposicionFamiliar from 'trabajoSocial/composicion_familiar/view/ComposicionFamiliar.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import SaludEmpleado from 'trabajoSocial/salud/view/SaludEmpleado.vue'
import { opcionesPeriodicidad } from 'config/recursosHumanos.utils'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { configuracionColumnasIngresos } from 'trabajoSocial/economia_familiar/domain/configuracionColumnasIngresos'
import { btnEliminarDefault, ordenarLista } from 'shared/utils'
import { acciones, accionesTabla } from 'config/utils'
import InformacionVivienda from 'trabajoSocial/informacion_vivienda/view/InformacionVivienda.vue'
import ServiciosBasicos from 'trabajoSocial/servicios_basicos/view/ServiciosBasicos.vue'
import CroquisVivienda from 'trabajoSocial/informacion_vivienda/view/CroquisVivienda.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { useEmpleadoStore } from 'stores/empleado'
import { useNotificaciones } from 'shared/notificaciones'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { parentescos } from 'config/trabajoSocial.utils'
import { LocalStorage } from 'quasar'
import { ValidarListadoIngresosEconomia } from 'trabajoSocial/visitaDomiciliaria/application/validations/ValidarListadoIngresosEconomia'
import EconomiaFamiliar from 'trabajoSocial/economia_familiar/view/EconomiaFamiliar.vue'

export default defineComponent({
  components: {
    EconomiaFamiliar,
    ErrorComponent,
    NoOptionComponent,
    CroquisVivienda,
    ServiciosBasicos,
    InformacionVivienda,
    OptionGroupComponent,
    SaludEmpleado,
    SelectorImagen,
    ComposicionFamiliar,
    TabLayoutFilterTabs2,
    EssentialTable
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      VisitaDomiciliaria,
      new VisitaDomiciliariaController()
    )
    const {
      entidad: visita,
      accion,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { listar, cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { notificarAdvertencia, notificarCorrecto } = useNotificaciones()

    const empleadoStore = useEmpleadoStore()
    const empleado = ref(new Empleado())
    const tabDefecto = ref('1')
    const { empleados, filtrarEmpleados, cantones, filtrarCantones } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        }
      })

      // configuracion de listados
      empleados.value = listadosAuxiliares.empleados
      listadosAuxiliares.cantones = JSON.parse(
        LocalStorage.getItem('cantones')!.toString()
      )
      cantones.value = listadosAuxiliares.cantones
    })

    /********************************************
     * HOOKS
     ********************************************/
    onReestablecer(async () => {
      empleado.value.hydrate(new Empleado())
    })
    onConsultado(async () => {
      empleadoStore.idEmpleado = visita.empleado
      await empleadoStore.cargarEmpleado()
      empleado.value = empleadoStore.empleado
    })
    /********************************************
     * REGLAS DE VALIDACIONES
     ********************************************/

    const reglas = {
      empleado: { required },
      lugar_nacimiento: { required },
      canton: { required },
      contacto_emergencia: { required },
      parentesco_contacto_emergencia: { required },
      telefono_contacto_emergencia: { required },
      imagen_genograma: {
        required: requiredIf(() => accion.value === acciones.editar)
      },
      imagen_visita_domiciliaria: { required },
      diagnostico_social: { required },
      observaciones: { required },
      vivienda: {
        tipo: { required },
        telefono: { required },
        material_paredes: { required },
        material_techo: { required },
        material_piso: { required },
        comodidad_espacio_familiar: { required }
      },
      salud: {
        frecuencia_asiste_medico: { required },
        practica_deporte: { required },
        frecuencia_practica_deporte: {
          required: requiredIf(() => visita.salud.practica_deporte)
        },
        deporte_practicado: {
          required: requiredIf(() => visita.salud?.practica_deporte)
        }
      }
    }
    const v$ = useVuelidate(reglas, visita)
    setValidador(v$.value)

    const validarListadoIngreso = new ValidarListadoIngresosEconomia(visita)
    mixin.agregarValidaciones(validarListadoIngreso)

    /********************************
     * FUNCIONES
     *******************************/
    async function filtrarListadoVisitas(tab: string) {
      tabDefecto.value = tab
      await listar({ estado: tab })
    }

    async function empleadoSeleccionado() {
      const visitaOFichaEncontrada = ref()
      empleadoStore.idEmpleado = visita.empleado
      await empleadoStore.cargarEmpleado()
      empleado.value = empleadoStore.empleado
      if (await empleadoStore.tieneVisitaDomiciliaria()) {
        visitaOFichaEncontrada.value =
          await empleadoStore.obtenerUltimaVisitaDomiciliaria()
        console.log(visitaOFichaEncontrada.value)
        visita.hydrate(visitaOFichaEncontrada.value)
        notificarCorrecto(
          'Se ha encontrado una visita domiciliaria del empleado seleccionado'
        )
      } else {
        if (await empleadoStore.tieneFichaSocioeconomica()) {
          visitaOFichaEncontrada.value =
            await empleadoStore.obtenerUltimaFichaSocieconomica()
          visita.hydrate(visitaOFichaEncontrada.value)
          notificarCorrecto(
            'Se ha encontrado una ficha socioeconomica del empleado seleccionado'
          )
        } else
          notificarAdvertencia(
            'El empleado seleccionado aún no tiene ficha socioeconomica'
          )
      }
    }

    /********************************
     * BOTONES DE TABLA
     *******************************/

    return {
      mixin,
      v$,
      visita,
      accion,
      disabled,
      configuracionColumnas: configuracionColumnasVisitaDomiciliaria,
      configuracionColumnasIngresos,
      tabOptions: tabOptionsProveedoresInternacionales,
      tabDefecto,
      acciones,
      accionesTabla,
      empleado,

      //listados
      parentescos,
      empleados,
      filtrarEmpleados,
      cantones,
      filtrarCantones,
      opcionesPeriodicidad,

      //funciones
      empleadoSeleccionado,
      filtrarListadoVisitas,
      ordenarLista,

      //botones de tabla
      btnEliminarDefault
    }
  }
})
