// Dependencias
import { defineComponent, ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

// Mixin
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

// Configuración de las columnas
import { configuracionColumnasNoticias } from '../domain/configuracionColumnasNoticias'

// Controladores
import { NoticiaController } from '../infraestructure/NoticiaController'
import { Noticia } from '../domain/Noticia'

// Opciones de la pestaña
import { tabOptionsNoticias } from 'config/utils'

import { useAuthenticationStore } from 'stores/authentication'
import { maskFecha } from 'src/config/utils'
import { CategoriaController } from 'pages/intranet/categorias/infraestructure/CategoriaController'
import { EtiquetaController } from 'pages/intranet/etiquetas/infraestructure/EtiquetaController'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'

export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialEditor, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(Noticia, new NoticiaController())

    const { entidad: noticia, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()
    const store = useAuthenticationStore()

    const categorias = ref([])
    const etiquetas = ref([])

    cargarVista(async () => {
      await obtenerListados({
        categorias: new CategoriaController(),
        etiquetas: new EtiquetaController()
      })

      categorias.value = listadosAuxiliares.categorias
      // etiquetas.value = listadosAuxiliares.etiquetas
      noticia.autor = store.user.nombres + ' ' + store.user.apellidos
    })

    /*****************************************************************************************
     * Hooks
     ****************************************************************************************/
    onReestablecer(() => {
      noticia.autor = store.user.nombres + ' ' + store.user.apellidos
    })


    const maxWords = (val: string) => {
      if (!val) return true
      const wordCount = val.trim().split(/\s+/).length
      return wordCount <= 150 || `La descripción no puede tener más de 150 palabras. Actualmente tiene ${wordCount} palabras.`
    }

    /*****************************************************************************************
     * Validaciones
     ****************************************************************************************/
    const reglas = computed(() => ({
      titulo: { required },
      autor: { required },
      categoria: { required },
      fecha_vencimiento: { required },
      imagen_noticia: { required },
      descripcion: { required, maxWords },
    }))

    const v$ = useVuelidate(reglas, noticia)
    setValidador(v$.value)

    /*****************************************************************************************
     * Funciones
     ****************************************************************************************/
    function filtrarNoticias(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
    }

    function categoriaSeleccionada(val) {
      etiquetas.value = listadosAuxiliares.etiquetas.filter((etiqueta) => etiqueta.categoria_id === val)
    }

    return {
      mixin, disabled,
      noticia,
      configuracionColumnas: configuracionColumnasNoticias,
      tabOptionsNoticias,
      v$,
      maskFecha,
      accion,

      // funciones
      filtrarNoticias,
      categoriaSeleccionada,

      // listados,
      categorias,
      etiquetas,
    }
  },
})
