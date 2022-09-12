// Dependencias
import { configuracionColumnasProductos } from '../domain/configuracionColumnasProductos'
import { configuracionColumnasCategorias } from 'pages/bodega/categorias/domain/configuracionColumnasCategorias'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useOrquestadorSelectorCategorias } from '../application/OrquestadorSelectorCategorias'
import { ProductoController } from '../infraestructure/ProductoController'
import { Producto } from '../domain/Producto'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: { TabLayout, EssentialSelectableTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Producto,
      new ProductoController())
    const { entidad: producto, disabled, accion } = mixin.useReferencias()
    const {onConsultado, onReestablecer}= mixin.useHooks()
    const { setValidador } = mixin.useComportamiento()

    // Reglas de validacion
    const reglas = {
      nombre: { required },
      categoria: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, producto)
    setValidador(v$.value)

    const {
      refListadoSeleccionable: refListadoSeleccionableCategorias,
      criterioBusqueda: criterioBusquedaCategoria,
      listado: listadoCategorias,
      listar: listarCategorias,
      limpiar: limpiarCategoria,
      seleccionar: seleccionarCategoria,
    } = useOrquestadorSelectorCategorias(producto, 'categorias')

    onReestablecer(()=>(criterioBusquedaCategoria.value =null))
    onConsultado(()=>seleccionarCategoria(producto.categoria))

    return {
      mixin,
      producto,
      disabled,
      accion, 
      v$,
      configuracionColumnas: configuracionColumnasProductos,
      //Selector
      refListadoSeleccionableCategorias,
      criterioBusquedaCategoria,
      listadoCategorias,
      listarCategorias,
      limpiarCategoria,
      seleccionarCategoria,
      configuracionColumnasCategorias
    }
  },
})
