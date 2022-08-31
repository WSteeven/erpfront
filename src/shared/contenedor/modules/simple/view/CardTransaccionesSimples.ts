// Dependencias
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  UnwrapRef,
} from 'vue'
// Componentes
import CardImage from '@componentes/cards/cardImage/view/CardImage.vue'
import ButtonSubmits from '@shared/componentes/buttonSubmits/view/buttonSubmits.vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.js'
// Logica y controladores
import { ContenedorSimpleMixin } from '@/app/shared/contenedor/modules/simple/application/contenedorSimple.mixin'
import { MiNegocio } from '@/@app/negocios/modules/misNegocios/domain/minegocio.domain'

export default defineComponent({
  name: 'CardTransaccionesSimples',
  components: {
    ButtonSubmits,
    CardImage,
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
    tituloModal: {
      type: String,
      required: false,
      default: 'Modal',
    },
    cbSeleccionarCard: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const refFormularioModal = ref()
    const codigoRegistro = ref()
    let modal: UnwrapRef<any>

    onMounted(() => (modal = new Modal(refFormularioModal.value)))

    // mixin
    const mixin: UnwrapRef<any> = reactive(props.mixin)
    const { listar, guardar, reestablecer, notificaciones } =
      mixin.useComportamiento()

    const { entidad, listado, accion } = mixin.useReferencias()

    listar()
    const negociosPropietarioListado = computed(() =>
      listado.value.filter(
        (negocio: MiNegocio) => negocio.es_propietario === true
      )
    )

    const negociosAsociadoListado = computed(() =>
      listado.value.filter(
        (negocio: MiNegocio) => negocio.es_propietario === false
      )
    )

    const asociarme = () => {
      notificaciones.notificarAdvertencia('El código ingresado no es válido')
    }

    // Mostra / ocultar modal
    const mostrar = () => modal.show()
    const ocultar = () => {
      reestablecer()
      modal.hide()
    }

    return {
      refFormularioModal,
      // Referencias del mixin
      entidad,
      listado,
      accion,
      // Comportamiento del mixin
      listar,
      guardar,
      // reestablecer,
      // Propiedades del componente
      codigoRegistro,
      negociosPropietarioListado,
      negociosAsociadoListado,
      asociarme,
      ocultar,
      mostrar,
    }
  },
})
