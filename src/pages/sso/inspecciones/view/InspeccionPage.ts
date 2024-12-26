// Dependencias
import { configuracionColumnasInspecciones } from '../domain/configuracionColumnasInspecciones'
import {
  estadosIncidentes,
  estadosInspecciones,
  tabOptionsEstadosInspecciones
} from 'pages/sso/config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { required, requiredIf } from 'shared/i18n-validators'
import { defineComponent, nextTick, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { acciones, maskFecha } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import MultiplePageLayout from 'shared/contenedor/modules/simple/view/MultiplePageLayout.vue'
import SolicitudDescuentoPage from 'sso/solicitudesDescuentos/view/SolicitudDescuentoPage.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import CoordenadasInput from 'components/inputs/CoordenadasInput.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import IncidentePage from 'sso/incidentes/view/IncidentePage.vue'
import Estado from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { InspeccionController } from '../infraestructure/InspeccionController'
import { Inspeccion } from '../domain/Inspeccion'

export default defineComponent({
  name: 'inspecciones',
  components: { CoordenadasInput, TabLayoutFilterTabs2, Estado, IncidentePage, GestorArchivos, EssentialEditor, MultiplePageLayout, SolicitudDescuentoPage },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      Inspeccion,
      new InspeccionController()
    )
    const {
      entidad: inspeccion,
      disabled,
      listadosAuxiliares,
      accion,
      tabsPage,
    } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onConsultado, onReestablecer, onBeforeGuardar, onGuardado, onModificado, onBeforeModificar } = mixin.useHooks()

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
    const refArchivo = ref()
    const refIncidentePage = ref()
    const idEntidad = ref()
    inspeccion.responsable = authenticationStore.user.apellidos + ' ' + authenticationStore.user.nombres

    /*************
     * Funciones
     *************/
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    function filtrarInspecciones(tab: string) {
      listar({ estado: tab })
      tabActual.value = tab
    }

    const subirArchivos = async () => await refArchivo.value.subir()

    const marcarTieneIncidencias = () => {
      refIncidentePage.value.incidente.es_parte_inspeccion = true
      refIncidentePage.value.incidente.inspeccion = inspeccion.id
    }

    const irIncidencias = () => {
      tabsPage.value = '2'
      nextTick(() => {
        refIncidentePage.value.tabs = 'listado'
        refIncidentePage.value.refrescarListados('inspecciones')
        refIncidentePage.value.filtrarIncidentes(estadosIncidentes.CREADO, { inspeccion_id: inspeccion.id })
        marcarTieneIncidencias()
      })
    }

    /*********
     * Reglas
     *********/
    const rules = {
      titulo: { required },
      descripcion: { required },
      fecha_inicio: { required },
      empleado_involucrado: { requiredIf: requiredIf(!inspeccion.tiene_incidencias) },
      coordenadas: { requiredIf: requiredIf(!inspeccion.tiene_incidencias) },
    }

    const validador$ = useVuelidate(rules, inspeccion)
    setValidador(validador$.value)

    /********
     * Hooks
     ********/
    onConsultado(() => {
      // refIncidentePage.value.idInspeccion = inspeccion.id

      inspeccion.tiene_incidencias = inspeccion.tiene_incidencias || !!inspeccion.cantidad_incidentes
      setTimeout(() => refArchivo.value.listarArchivosAlmacenados(inspeccion.id), 1)

    })

    onGuardado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
    })

    onBeforeGuardar(() => {
      if (inspeccion.tiene_incidencias) {
        inspeccion.empleado_involucrado = null
        inspeccion.coordenadas = null
      }
    })

    onBeforeModificar(() => {
      if (inspeccion.tiene_incidencias) {
        inspeccion.empleado_involucrado = null
        inspeccion.coordenadas = null
      }
    })

    onModificado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
    })

    onReestablecer(
      () => {
        inspeccion.responsable = authenticationStore.user.nombres + ' ' + authenticationStore.user.apellidos
        refArchivo.value.limpiarListado()
      })

    /********
     * Init
     ********/
    filtrarInspecciones(estadosInspecciones.CREADO)

    return {
      validador$,
      refIncidentePage,
      idEntidad,
      refArchivo,
      mixin,
      inspeccion,
      accion,
      disabled,
      maskFecha,
      configuracionColumnasInspecciones,
      tabActual,
      filtrarInspecciones,
      tabOptionsEstadosInspecciones,
      acciones,
      empleados,
      filtrarEmpleados,
      marcarTieneIncidencias,
      irIncidencias,
    }
  }
})
