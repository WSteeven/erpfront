// Dependencias
import { configuracionColumnasProductos } from '../domain/configuracionColumnasProductos'
import { configuracionColumnasDetallesProductos } from '../domain/configuracionColumnasDetalles'
import { required } from 'shared/i18n-validators'
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
import { Producto } from '../domain/Producto'
import { ProductoController } from '../infraestructure/ProductoController'
import { CategoriaController } from 'pages/bodega/categorias/infraestructure/CategoriaController'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { acciones } from 'config/utils';
import { UnidadMedidaController } from 'pages/bodega/unidades_medidas/infraestructure/UnidadMedidaController'

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
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

    //Imagenes
    /* const mixinImagenes = new ContenedorSimpleMixin(
      Imagen,
      new CategoriaController()
    )
    const { entidad: imagen } = mixinImagenes.useReferencias() */

    const opciones = ref([])
    const unidades_medidas = ref([])

    //Obtener el listado de las categorias
    cargarVista(async() => {
      obtenerListados({
        categorias: {
          controller: new CategoriaController(),
          params: { campos: 'id,nombre' },
        },
        unidades_medidas: new UnidadMedidaController()
      })
    })

    // Reglas de validacion
    const reglas = {
      nombre: { required },
      categoria: { required },
      unidad_medida: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, producto)
    setValidador(v$.value)
    opciones.value = listadosAuxiliares.categorias
    unidades_medidas.value = listadosAuxiliares.unidades_medidas

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
      opciones,
      unidades_medidas,

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
