import { defineComponent, ref } from 'vue'
import { ProductoVentas } from '../domain/ProductoVentas'
import { configuracionColumnasProductoVentas } from '../domain/configuracionColumnasProductoVentas'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ProductoVentasController } from '../infrestructure/ProductoVentasController'
import { PlanesController } from 'pages/ventas-claro/planes/infrestructure/PlanesController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { CambiarEstadoProductoVenta } from '../application/CambiarEstadoProductoVenta'
import { useAuthenticationStore } from 'stores/authentication'
import { acciones } from 'config/utils'
import { tabOptionsProductos } from 'config/ventas.utils'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { OptionGroup } from 'components/optionGroup/domain/OptionGroup'
import { Planes } from 'pages/ventas-claro/planes/domain/Planes'
import { endpoints } from 'config/api'
import { descargarPlantillaBasePorNombre } from 'shared/utils'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: {
    GestorDocumentos,
    OptionGroupComponent,
    NoOptionComponent,
    ErrorComponent,
    TabLayoutFilterTabs2
  },
  setup() {
    /*********
     * Stores
     *********/
    useCargandoStore().setQuasar(useQuasar())
    useNotificacionStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      ProductoVentas,
      new ProductoVentasController()
    )
    const mixin2 = new ContenedorSimpleMixin(
      ProductoVentas,
      new ProductoVentasController()
    ) // mixin alternativo para que no se duplique listado
    const {
      entidad: producto,
      disabled,
      accion,
      listadosAuxiliares,
      listado,
      tabs
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado } = mixin.useHooks()
    const { confirmar, notificarCorrecto, notificarError } = useNotificaciones()
    const planes = ref([])
    const modoIndividual = ref(true)
    const refArchivo = ref()
    const tabDefecto = ref('1')

    cargarVista(async () => {
      await obtenerListados({
        planes: {
          controller: new PlanesController(),
          params: { campos: 'id,nombre' }
        }
      })
      planes.value = listadosAuxiliares.planes
    })

    /*************
     * HOOKS
     **************/
    onReestablecer(() => {
      modoIndividual.value = true
    })
    onConsultado(() => {
      modoIndividual.value = true
    })
    /*************
     * Validaciones
     **************/
    const reglas = {
      plan: { required: true },
      nombre: { required: true },
      bundle: { required: true },
      precio: { required: true }
    }
    const v$ = useVuelidate(reglas, producto)
    setValidador(v$.value)

    /***********************
     * Funciones
     ***********************/
    async function filtrarProductos(tab: string) {
      tabDefecto.value = tab
      await listar({ activo: tab })
    }

    function filtrarPlanes(
      val: string,
      update: (callback: () => void) => void
    ) {
      if (val === '') {
        update(() => {
          planes.value = listadosAuxiliares.planes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        planes.value = listadosAuxiliares.planes.filter(
          (v: Planes) => v.nombre!.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function subirArchivos() {
      try {
        await refArchivo.value.subir()

        refArchivo.value.quiero_subir_archivos = false
        modoIndividual.value = true
        // retrasar la ejecucion de esta funcion
        setTimeout(async () => {
          refArchivo.value?.limpiarListado()
          tabs.value = 'listado'
          await filtrarProductos('1')
        }, 1000)
      } catch (error) {
        console.error(`Error es: ${error}`)
        notificarError('' + error)
      }
    }

    async function descargarPlantillaExcel() {
      await descargarPlantillaBasePorNombre('PLANTILLA GUIA COMERCIAL CLARO')
    }

    /***********************
     * Botones de tabla
     ***********************/
    const btnDesactivar: CustomActionTable = {
      titulo: 'Desactivar',
      icono: 'bi-toggle2-off',
      color: 'negative',
      tooltip: 'Desactivar',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de desactivar este producto?', async () => {
          try {
            cargando.activar()
            await new CambiarEstadoProductoVenta().anular(entidad.id)
            listado.value.splice(posicion, 1)
            notificarCorrecto('Desactivado correctamente')
          } catch (error: any) {
            notificarError('No se pudo desactivar el producto!')
          } finally {
            cargando.desactivar()
          }
        })
      },
      visible: ({ entidad }) =>
        entidad.activo && store.can('puede.desactivar.productos_ventas')
    }

    const btnActivar: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-on',
      color: 'positive',
      tooltip: 'Activar',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de activar este producto?', async () => {
          try {
            cargando.activar()
            await new CambiarEstadoProductoVenta().anular(entidad.id)
            listado.value.splice(posicion, 1)
            notificarCorrecto('Activado correctamente')
          } catch (error: any) {
            notificarError('No se pudo activar el producto!')
          } finally {
            cargando.desactivar()
          }
        })
      },
      visible: ({ entidad }) =>
        !entidad.activo && store.can('puede.activar.productos_ventas')
    }

    const options: OptionGroup[] = [
      {
        label: 'INDIVIDUAL',
        value: true
      },
      {
        label: 'POR LOTES',
        value: false
      }
    ]

    return {
      mixin,
      mixin2,
      producto,
      filtrarPlanes,
      planes,
      tabDefecto,
      disabled,
      accion,
      v$,
      acciones,
      configuracionColumnas: configuracionColumnasProductoVentas,
      refArchivo,
      subirArchivos,
      endpoint: endpoints.productos_ventas_lotes,
      modoIndividual,
      options,
      tabOptionsProductos,

      //botones de tabla
      btnActivar,
      btnDesactivar,

      //funciones
      descargarPlantillaExcel,
      filtrarProductos
    }
  }
})
