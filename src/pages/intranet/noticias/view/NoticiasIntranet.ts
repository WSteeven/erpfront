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
import { obtenerFechaActual } from '../../../../shared/utils'

export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    const mixin = new ContenedorSimpleMixin(Noticia, new NoticiaController())

    const store = useAuthenticationStore()
    const date = ref(obtenerFechaActual(maskFecha))

    const cat_etiq = {
      Vacante: ['Promocion Interna'],
      Capacitacion: ['Interna', 'Externa'],
      Feriados: ['Nacional', 'Local'],
      'Nota Luctuosa': [],
      Seguridad: ['Normativa', 'Advertencia', 'Solicitud'],
      Médico: ['Campaña', 'Vacunación', 'Exámenes Médicos'],
      Politica: ['Interna', 'Externa'],
      'Ente Regulador': ['Avisos', 'Aporte Personal'],
    }

    const categorias = Object.keys(cat_etiq)

    const selectedCategory = ref<string | null>(null)
    const selectedTags = ref<string[]>([])
    const filteredEtiquetas = ref<string[]>([])

    function updateEtiquetas() {
      if (selectedCategory.value) {
        filteredEtiquetas.value = cat_etiq[selectedCategory.value]
      } else {
        filteredEtiquetas.value = []
      }
    }

    const maxWords = (val: string) => {
      if (!val) return true
      const wordCount = val.trim().split(/\s+/).length
      return wordCount <= 150 || `La descripción no puede tener más de 150 palabras. Actualmente tiene ${wordCount} palabras.`
    }

    const {
      entidad: noticia,
      accion,
    } = mixin.useReferencias()
    const { setValidador, listar, cargarVista } =
      mixin.useComportamiento()
    const { onConsultado, onBeforeModificar } = mixin.useHooks()

    const formRef = ref(null)

    const esConsultado = ref(false)
    onBeforeModificar(() => (esConsultado.value = true))

    onConsultado(() => {
      // Lógica después de consultar la noticia
    })

    cargarVista(async () => {
      // Establecer el autor y la fecha de creación al cargar la vista
      noticia.autor = store.user.nombres + ' ' + store.user.apellidos
      noticia.fecha_creacion = date.value

      await listar()
    })

    const reglas = computed(() => ({
      titulo: { required },
      autor: { required },
      fecha_creacion: { required },
      url_imagen: { required },
      descripcion: { required, maxWords },
    }))

    const v$ = useVuelidate(reglas, noticia)
    setValidador(v$.value)

    function submitForm() {
      if (v$.value.$invalid) {
        v$.value.$touch()
        return
      }
      // Lógica para enviar el formulario
    }

    function resetForm() {
      // Lógica para restablecer el formulario
    }

    function filtrarNoticia(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
    }

    return {
      mixin,
      noticia,
      configuracionColumnas: configuracionColumnasNoticias,
      tabOptionsNoticias,
      formRef,
      v$,
      submitForm,
      resetForm,
      filtrarNoticia,
      esConsultado,
      accion,
      cat_etiq,
      categorias,
      selectedCategory,
      selectedTags,
      filteredEtiquetas,
      updateEtiquetas,
    }
  },
})
