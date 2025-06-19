// Dependencias
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useAuthenticationStore } from 'stores/authentication'
import { computed, defineComponent, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: true,
    },
    mostrarButtonSubmits: {
      type: Boolean,
      default: true,
    },
    permitirConsultar: {
      type: Boolean,
      default: true,
    },
    permitirGuardar: {
      type: Boolean,
      default: true,
    },
    forzarGuardar: {
      type: Boolean,
      default: false,
    },
    permitirEditar: {
      type: Boolean,
      default: true,
    },
    forzarEditar: {
      type: Boolean,
      default: false,
    },
    permitirEliminar: {
      type: Boolean,
      default: true,
    },
    permitirCancelar: {
      type: Boolean,
      default: true,
    },
    full: {
      type: Boolean,
      default: false,
    },
    labelGuardar: {
      type: String,
      default: 'Guardar',
    },
    labelEditar: {
      type: String,
      default: 'Guardar cambios',
    },
  },
  components: { ButtonSubmits },
  setup(props) {
    /********
     * Mixin
     ********/
    const { guardar, editar, eliminar, consultar, reestablecer } = props.mixin.useComportamiento()
    const { entidad, accion, filtros } = props.mixin.useReferencias()

    /************
     * Variables
     ************/
    const router = useRoute()
    const store = useAuthenticationStore()

    const currentInstance = getCurrentInstance()
    const componentName = currentInstance?.parent?.type.name
    console.log(currentInstance)

    const puedeVer = computed(() =>
      store.can(`puede.ver.${router.name?.toString()}`) && props.permitirConsultar
    )
    const puedeCrear = computed(() =>
      store.can(`puede.crear.${componentName ?? router.name?.toString()}`) && props.permitirGuardar
    )
    const puedeEditar = computed(() =>
      store.can(`puede.editar.${componentName ?? router.name?.toString()}`) && props.permitirEditar || props.forzarEditar
    )
    const puedeEliminar = computed(() =>
      store.can(`puede.eliminar.${componentName ?? router.name?.toString()}`) && props.permitirEliminar
    )

    return {componentName,
      guardar,
      reestablecer,
      entidad,
      accion,
      filtros,
      // acciones tabla
      consultar,
      editar,
      eliminar,
      puedeVer,
      puedeCrear,
      puedeEditar,
      puedeEliminar,
      storeCargando: useCargandoStore(),
    }
  },
})
