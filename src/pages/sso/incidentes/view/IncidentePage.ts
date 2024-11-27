// Dependencias
import { estadosIncidentes, estadosInspecciones, tabOptionsEstadosIncidentes, tabOptionsTiposIncidentes, tiposIncidentes } from 'pages/sso/config/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { required, requiredIf } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { acciones } from 'config/utils'

// Componentes
import SeleccionProductosUsuario from 'components/inputs/seleccionProductosUsuario/view/SeleccionProductosUsuario.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import CoordenadasInput from 'components/inputs/CoordenadasInput.vue'
import Estado from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { configuracionColumnasProductosSeleccionadosIncidente } from '../domain/configuracionColumnasProductosSeleccionadosIncidente'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { InspeccionController } from 'pages/sso/inspecciones/infraestructure/InspeccionController'
import { configuracionColumnasIncidente } from '../domain/configuracionColumnasIncidente'
import { ProductoSeleccionadoIncidente } from '../domain/ProductoSeleccionadoIncidente'
import { IncidenteController } from '../infraestructure/IncidenteController'
import { Incidente } from '../domain/Incidente'

export default defineComponent({
  components: { TabLayoutFilterTabs2, CoordenadasInput, Estado, GestorArchivos, SeleccionProductosUsuario },
  setup() {
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
    )
    const { entidad: incidente, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados } = mixin.useComportamiento()

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
    const tabActual = ref()
    const refArchivo = ref()
    const id = ref()
    const propietario = ref(authenticationStore.user.id)
    const { prompt } = useNotificaciones()

    /*********
     * Reglas
     *********/
    const rules = {
      titulo: { required },
      descripcion: { required },
      coordenadas: { required },
      tipo_incidente: { required },
      empleado_involucrado: { required },
      inspeccion: { requiredIf: requiredIf(incidente.es_parte_inspeccion) },
    }

    const v$ = useVuelidate(rules, incidente)
    setValidador(v$.value)

    /************
     * Funciones
     ************/
    const { empleados, filtrarEmpleados, inspecciones, filtrarInspecciones } = useFiltrosListadosSelects(listadosAuxiliares)

    function filtrarIncidentes(tab: string) {
      listar({ estado: tab })
      tabActual.value = tab
    }

    async function refrescarListados(nombreListado: string) {
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
          })
          break
      }
    }

    /****************
     * Botones tabla
     ****************/
    const btnEditarMotivoCambio: CustomActionTable<ProductoSeleccionadoIncidente> = {
      titulo: 'Editar motivo de cambio',
      icono: 'bi-check2-square',
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
      icono: 'bi-check2-square',
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
      accion: async ({ posicion }) => incidente.detalles_productos.splice(posicion, 1)
    }

    /********
     * Init
     ********/
    filtrarIncidentes(estadosIncidentes.CREADO)

    return {
      v$,
      id,
      refArchivo,
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
      refrescarListados,
    }
  }
})