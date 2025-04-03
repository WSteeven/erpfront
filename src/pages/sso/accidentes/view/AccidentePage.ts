// Dependencias
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { tabOptionsEstadosAccidentes } from 'pages/sso/config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { required } from 'shared/i18n-validators'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { acciones } from 'config/utils'

// Componentes
import SeguimientoAccidentePage from 'sso/accidentes/modules/seguimientoAccidente/view/SeguimientoAccidentePage.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import CoordenadasInput from 'components/inputs/CoordenadasInput.vue'
import FechaHora from 'components/inputs/FechaHoraInput.vue'

// Logica y controladores
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasAccidente } from '../domain/configuracionColumnasAccidente'
import { AccidenteController } from '../infraestructure/AccidenteController'
import { Accidente } from '../domain/Accidente'

export default defineComponent({
  components: { TabLayoutFilterTabs2, CoordenadasInput, FechaHora, GestorArchivos, SeguimientoAccidentePage },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      Accidente,
      new AccidenteController(),
      new ArchivoController()
    )
    const { entidad: accidente, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onConsultado, onGuardado, onModificado, onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        }
      })
    })

    /*************
     * Variables
     *************/
    const tabActual = ref()
    const idEntidad = ref()
    const refArchivo = ref()
    const refSeguimiento = ref()

    /*********
     * Reglas
     *********/
    const rules = {
      titulo: { required },
      descripcion: { required },
      coordenadas: { required },
      lugar_accidente: { required },
      consecuencias: { required },
      empleados_involucrados: { required },
    }

    const v$ = useVuelidate(rules, accidente)
    setValidador(v$.value)

    /*************
     * Funciones
     *************/
    const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)

    function filtrarAccidentes(tab: string) {
      listar({ estado: tab })
      tabActual.value = tab
    }

    const subirArchivos = async () => await refArchivo.value.subir()

    /********
     * Hooks
     ********/
    onConsultado(() => {
      setTimeout(() => refArchivo.value.listarArchivosAlmacenados(accidente.id), 1)
      refSeguimiento.value.consultar({ id: accidente.seguimiento_accidente })
      refSeguimiento.value.tabsPage = '1'
      console.log('consultado')
    })

    onGuardado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
    })

    onModificado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
    })

    onReestablecer(() => {
      refArchivo.value.limpiarListado()
      accidente.empleado_reporta = authenticationStore.user.apellidos + ' ' + authenticationStore.user.nombres
    })

    /*******
     * Init
     *******/
    accidente.empleado_reporta = authenticationStore.user.apellidos + ' ' + authenticationStore.user.nombres

    return {
      v$,
      mixin,
      accidente,
      disabled,
      tabActual,
      idEntidad,
      refArchivo,
      refSeguimiento,
      filtrarAccidentes,
      configuracionColumnasAccidente,
      tabOptionsEstadosAccidentes,
      empleados, filtrarEmpleados,
      accion,
      acciones,
    }
  }
})