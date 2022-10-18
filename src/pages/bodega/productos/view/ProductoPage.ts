// Dependencias
import { configuracionColumnasProductos } from '../domain/configuracionColumnasProductos'
import { configuracionColumnasCategorias } from 'pages/bodega/categorias/domain/configuracionColumnasCategorias'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
//import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagenMultiple from 'components/SelectorImagenMultiple.vue'
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
    SelectorImagenMultiple,
    //EssentialSelectableTable,
    LabelAbrirModal,
    ModalesEntidad,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Producto, new ProductoController())
    const { entidad: producto, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

    //Imagenes
    /* const mixinImagenes = new ContenedorSimpleMixin(
      Imagen,
      new CategoriaController()
    )
    const { entidad: imagen } = mixinImagenes.useReferencias() */

    const opciones = ref([]);

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
    opciones.value = listadosAuxiliares.categorias

    return {
      mixin,
      producto,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasProductos,
      //listado
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
            opciones.value = listadosAuxiliares.categorias
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones.value = listadosAuxiliares.categorias.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
    }
  },
})
