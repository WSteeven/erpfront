// Dependencias
import { defineComponent, ref, reactive, computed } from 'vue'
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

    const {
      entidad: noticia,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, listar, consultar, cargarVista } = mixin.useComportamiento()
    const { onConsultado, onBeforeModificar } = mixin.useHooks()

    const formRef = ref(null)

    const esConsultado = ref(false)
    onBeforeModificar(() => (esConsultado.value = true))

    onConsultado(() => {
      // Lógica después de consultar la noticia
    })

    cargarVista(async () => {
      await listar()
    })

    const reglas = computed(() => ({
      titulo: { required },
      autor: { required },
      fecha_creacion: { required },
      url_imagen: { required },
      descripcion: { required }
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
      formRef.value.reset()
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
    }
  },
})
