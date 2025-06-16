// Dependencias
import { configuracionColumnasProductos } from '../domain/configuracionColumnasProductos'
import { configuracionColumnasDetallesProductos } from '../domain/configuracionColumnasDetalles'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
//import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
//Modal para crear nuevas categorias

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Producto } from '../domain/Producto'
import { ProductoController } from '../infraestructure/ProductoController'
import { CategoriaController } from 'pages/bodega/categorias/infraestructure/CategoriaController'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { acciones, tiposProductos } from 'config/utils'
import { UnidadMedidaController } from 'pages/bodega/unidades_medidas/infraestructure/UnidadMedidaController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    TabLayout
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Producto, new ProductoController())
    const {
      entidad: producto,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    const unidades_medidas = ref([])

    const { categorias, filtrarCategorias } =
      useFiltrosListadosSelects(listadosAuxiliares)

    //Obtener el listado de las categorias
    cargarVista(async () => {
      await obtenerListados({
        categorias: {
          controller: new CategoriaController(),
          params: { campos: 'id,nombre' }
        },
        unidades_medidas: new UnidadMedidaController()
      })

      categorias.value = listadosAuxiliares.categorias
      unidades_medidas.value = listadosAuxiliares.unidades_medidas
    })

    // Reglas de validacion
    const reglas = {
      nombre: { required },
      categoria: { required },
      unidad_medida: { required },
      tipo: { required }
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, producto)
    setValidador(v$.value)

    return {
      mixin,
      producto,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasProductos,
      acciones,
      configuracionColumnasDetallesProductos,

      //listado
      categorias,
      filtrarCategorias,
      unidades_medidas,
      tiposProductos
    }
  }
})
