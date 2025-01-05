// Dependencias
import { configuracionColumnasProductosSeleccionadosIncidente } from '../domain/configuracionColumnasProductosSeleccionadosIncidente'
import { estadosIncidentes, estadosInspecciones, tabOptionsEstadosIncidentes, tabOptionsTiposIncidentes, tiposIncidentes } from 'pages/sso/config/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useAuthenticationStore } from 'stores/authentication'
import { required, requiredIf } from 'shared/i18n-validators'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones, accionesTabla } from 'config/utils'
import { computed, defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'

// Componentes
import SeleccionProductosUsuario from 'components/inputs/seleccionProductosUsuario/view/SeleccionProductosUsuario.vue'
import SeguimientoIncidentePage from 'sso/incidentes/seguimientoIncidente/view/SeguimientoIncidentePage.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import CoordenadasInput from 'components/inputs/CoordenadasInput.vue'
import Estado from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { InspeccionController } from 'pages/sso/inspecciones/infraestructure/InspeccionController'
import { configuracionColumnasIncidente } from '../domain/configuracionColumnasIncidente'
import { ProductoSeleccionadoIncidente } from '../domain/ProductoSeleccionadoIncidente'
import { IncidenteController } from '../infraestructure/IncidenteController'
import { Incidente } from '../domain/Incidente'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'incidentes',
  components: { TabLayoutFilterTabs2, CoordenadasInput, Estado, GestorArchivos, SeleccionProductosUsuario, SeguimientoIncidentePage },
  emits: ['guardado'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      Incidente,
      new IncidenteController(),
      new ArchivoController()
    )
    const { entidad: incidente, disabled, listadosAuxiliares, accion, tabs } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados, consultar } = mixin.useComportamiento()
    const { onConsultado, onGuardado, onModificado, onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
          }
        },
        inspecciones: {
          controller: new InspeccionController(),
          params: {
            campos: 'id,titulo',
            estado: estadosInspecciones.CREADO,
          }
        },
      })
    })

    /*************
     * Variables
     *************/
    const refSeguimiento = ref()
    const tabActual = ref()
    const idEntidad = ref()
    const refArchivo = ref()
    const refCoordenadasInput = ref()
    const propietario = ref(authenticationStore.user.id)
    const { prompt, confirmar } = useNotificaciones()
    const enRutaInspeccion = computed(() => route.name === 'inspecciones')
    const route = useRoute()

    /*********
     * Reglas
     *********/
    const rules = computed(() => {
      if (enRutaInspeccion.value) return {}
      else return {
        titulo: { required },
        descripcion: { required },
        coordenadas: { required },
        tipo_incidente: { required },
        empleado_involucrado: { required },
        inspeccion: { requiredIf: requiredIf(incidente.es_parte_inspeccion) },
      }
    })

    const v$ = useVuelidate(rules, incidente)
    setValidador(v$.value)

    /************
     * Funciones
     ************/
    const { empleados, filtrarEmpleados, inspecciones, filtrarInspecciones } = useFiltrosListadosSelects(listadosAuxiliares)

    function filtrarIncidentes(tab: string, params?: any) {
      const rolCualquieraExceptoSSO = !authenticationStore.esSso
      params = {
        empleado_reporta_id: rolCualquieraExceptoSSO ? authenticationStore.user.id : null,
        inspeccion_id: enRutaInspeccion.value ? incidente.inspeccion : null,
        ...params,
      }
      // const idInspeccion = enRutaInspeccion.value ? incidente.inspeccion : null
      listar({ estado: tab, ...params })
      tabActual.value = tab
    }

    type listados = 'inspecciones'
    async function refrescarListados(nombreListado: listados) {
      switch (nombreListado) {
        case 'inspecciones':
          cargarVista(async () => {
            await obtenerListados({
              inspecciones: {
                controller: new InspeccionController(),
                params: {
                  campos: 'id,titulo',
                  estado: estadosInspecciones.CREADO,
                }
              },
            })
            inspecciones.value = listadosAuxiliares.inspecciones
          })
          break
      }
    }

    const subirArchivos = async () => await refArchivo.value.subir()

    /****************
     * Botones tabla
     ****************/
    const btnEditarMotivoCambio: CustomActionTable<ProductoSeleccionadoIncidente> = {
      titulo: 'Editar motivo de cambio',
      icono: 'bi-text-center',
      color: 'indigo',
      accion: async ({ entidad }) => {
        const config: CustomActionPrompt = {
          titulo: 'Motivo',
          mensaje: 'Ingrese el motivo por el que desea cambiar este item.',
          defecto: entidad.motivo_cambio,
          accion: async (motivo) => {
            entidad.motivo_cambio = motivo
          },
        }

        prompt(config)
      }
    }

    const btnEditarCantidad: CustomActionTable<ProductoSeleccionadoIncidente> = {
      titulo: 'Editar cantidad',
      icono: 'bi-pencil-square',
      color: 'indigo',
      accion: async ({ entidad }) => {
        const config: CustomActionPrompt = {
          titulo: 'Cantidad',
          mensaje: 'Ingrese la nueva cantidad.',
          tipo: 'number',
          defecto: entidad.cantidad,
          accion: async (cantidad) => {
            entidad.cantidad = cantidad
          },
        }

        prompt(config)
      }
    }

    const btnEliminar: CustomActionTable<ProductoSeleccionadoIncidente> = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      accion: async ({ posicion }) => confirmar('¿Está seguro de que desea eliminar la fila seleccionada?', () => incidente.detalles_productos.splice(posicion, 1))
    }

    const btnSeguimiento: CustomActionTable<Incidente> = {
      titulo: 'Seguimiento',
      icono: 'bi-check-square',
      color: 'positive',
      visible: ({ entidad }) => entidad.estado === estadosIncidentes.CREADO,
      accion: async ({ entidad }) => {
        consultar(entidad)
        accion.value = acciones.consultar
        tabs.value = 'formulario'
      }
    }

    /********
     * Hooks
     ********/
    onConsultado(() => {
      setTimeout(() => refArchivo.value.listarArchivosAlmacenados(incidente.id), 1)
      incidente.finalizado = incidente.estado === estadosIncidentes.FINALIZADO
      incidente.es_parte_inspeccion = !!incidente.inspeccion
      if (refSeguimiento.value) {
        refSeguimiento.value.consultarSeguimiento(incidente.seguimiento_incidente_id)
        refSeguimiento.value.tabsPage = '1'
      }
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
      emit('guardado')
    })

    /********
     * Init
     ********/
    if (!enRutaInspeccion.value) filtrarIncidentes(estadosIncidentes.CREADO)

    return {
      v$,
      idEntidad,
      refSeguimiento,
      refArchivo,
      refCoordenadasInput,
      mixin,
      incidente,
      disabled,
      accion,
      configuracionColumnasIncidente,
      tabOptionsEstadosIncidentes,
      tabOptionsTiposIncidentes,
      tiposIncidentes,
      filtrarIncidentes,
      tabActual,
      estadosIncidentes,
      acciones,
      empleados,
      filtrarEmpleados,
      inspecciones,
      filtrarInspecciones,
      propietario,
      configuracionColumnasProductosSeleccionadosIncidente,
      btnEditarMotivoCambio,
      btnEditarCantidad,
      btnEliminar,
      btnSeguimiento,
      refrescarListados,
      finalizar: () => incidente.estado = incidente.finalizado ? estadosIncidentes.FINALIZADO : estadosIncidentes.CREADO,
      columnas: [...configuracionColumnasProductosSeleccionadosIncidente, accionesTabla],
      subirArchivos,
      disableSeguimiento: false,
      tabs,
      enRutaInspeccion,
    }
  }
})