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


export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    /*********
    * Stores
    *********/
    useNotificacionStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(ProductoVentas, new ProductoVentasController())
    const { entidad: producto, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { confirmar, notificarCorrecto, notificarError } = useNotificaciones()
    const planes = ref([]);

    const tabDefecto = ref('1')

    cargarVista(async () => {
      await obtenerListados({
        planes: {
          controller: new PlanesController(),
          params: { campos: 'id,nombre' },
        },
      })
      planes.value = listadosAuxiliares.planes
    })
    /*************
    * Validaciones
    **************/
    const reglas = {
      plan: {
        required: true
      },
      bundle: {
        required: true,
      },
      precio: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, producto)
    setValidador(v$.value)

    /***********************
    * Funciones
    ***********************/
    function filtrarProductos(tab: string) {
      tabDefecto.value = tab
      listar({ activo: tab })
    }

    function filtrarPlanes(val, update) {
      if (val === '') {
        update(() => {
          planes.value = listadosAuxiliares.planes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        planes.value = listadosAuxiliares.planes.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
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
            const { result, response } = await new CambiarEstadoProductoVenta().anular(entidad.id)
            listado.value.splice(posicion, 1)
            notificarCorrecto('Desactivado correctamente')
          } catch (error: any) {
            notificarError('No se pudo desactivar el producto!')
          } finally {
            cargando.desactivar()
          }
        })
      }, visible: ({ entidad }) => entidad.activo && store.can('puede.desactivar.productos_ventas')
    }

    const btnActivar: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-on',
      color: 'positive',
      tooltip: 'Activar',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de desactivar este producto?', async () => {
          try {
            cargando.activar()
            const { result, response } = await new CambiarEstadoProductoVenta().anular(entidad.id)
            listado.value.splice(posicion, 1)
            notificarCorrecto('Desactivado correctamente')
          } catch (error: any) {
            notificarError('No se pudo desactivar el producto!')
          } finally {
            cargando.desactivar()
          }
        })
      }, visible: ({ entidad }) => !entidad.activo && store.can('puede.activar.productos_ventas')
    }




    return {
      mixin,
      producto,
      filtrarPlanes,
      planes, tabDefecto,
      disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasProductoVentas,

      tabOptionsProductos,


      //botones de tabla
      btnActivar,
      btnDesactivar,

      //funciones
      filtrarProductos,
    }
  }
})


