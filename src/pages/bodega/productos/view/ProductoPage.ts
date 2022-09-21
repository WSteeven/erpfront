// Dependencias
import { configuracionColumnasProductos } from '../domain/configuracionColumnasProductos'
import { configuracionColumnasCategorias } from 'pages/bodega/categorias/domain/configuracionColumnasCategorias'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
//Modal para crear nuevas categorias
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useOrquestadorSelectorCategorias } from '../application/OrquestadorSelectorCategorias'
import { Categoria } from 'pages/bodega/categorias/domain/Categoria'
import { Producto } from '../domain/Producto'
import { ComportamientoModalesProducto } from '../application/ComportamientoModalesProducto'
import { ProductoController } from '../infraestructure/ProductoController'
import { CategoriaController } from 'pages/bodega/categorias/infraestructure/CategoriaController'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: {
    TabLayout,
    EssentialSelectableTable,
    LabelAbrirModal,
    ModalesEntidad,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Producto, new ProductoController())
    const { entidad: producto, disabled, accion } = mixin.useReferencias()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { setValidador } = mixin.useComportamiento()

    //Categorias
    const mixinCategoria = new ContenedorSimpleMixin(
      Categoria,
      new CategoriaController()
    )
    const { listadosAuxiliares } = mixinCategoria.useReferencias()
    const { obtenerListados, cargarVista } = mixinCategoria.useComportamiento()

    //Obtener el listado de las categorias
    cargarVista(() => {
      obtenerListados({
        categorias: new CategoriaController(),
      })
    })

    // Reglas de validacion
    const reglas = {
      nombre: { required },
      categoria: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, producto)
    setValidador(v$.value)

    const modalesProducto = new ComportamientoModalesProducto()

    const {
      refListadoSeleccionable: refListadoSeleccionableCategorias,
      criterioBusqueda: criterioBusquedaCategoria,
      listado: listadoCategorias,
      listar: listarCategorias,
      limpiar: limpiarCategoria,
      seleccionar: seleccionarCategoria,
    } = useOrquestadorSelectorCategorias(producto, 'categorias')

    onReestablecer(() => (criterioBusquedaCategoria.value = null))
    onConsultado(() => seleccionarCategoria(producto.categoria))

    const opciones = listadosAuxiliares.categorias

    return {
      mixin,
      producto,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasProductos,
      //modal
      modalesProducto,
      //Selector
      refListadoSeleccionableCategorias,
      criterioBusquedaCategoria,
      listadoCategorias,
      listarCategorias,
      limpiarCategoria,
      seleccionarCategoria,
      configuracionColumnasCategorias,
      //listado
      listadosAuxiliares,
      opciones,
      
      /**
       * Función para filtrar el SELECT de categorias,
       * @param val String, tecla que ingresa el usuario para la busqueda
       * @param update actualizacion del listado con el filtro
       * @returns listado  con las coincidencias encontradas
       */
      filterFn(val, update) {
        if (val === '') {
          update(() => {
            opciones.categorias = listadosAuxiliares.categorias
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones.categorias = listadosAuxiliares.categorias.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
    }
  },
})
