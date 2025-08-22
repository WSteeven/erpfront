import { computed, defineComponent } from 'vue'
import { required } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlantillaBase } from 'sistema/plantillasBase/domain/PlantillaBase'
import { PlantillaBaseController } from 'sistema/plantillasBase/infraestructure/PlantillaBaseController'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { useVuelidate } from '@vuelidate/core'
import { acciones } from 'config/utils'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import CalloutComponent from 'components/CalloutComponent.vue'
import { configuracionColumnasPlantillasBase } from 'sistema/plantillasBase/domain/configuracionColumnasPlantillasBase'
import InputComponent from 'components/inputs/InputComponent.vue'
import FileComponent from 'components/documentos/view/FileComponent.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: {
    ButtonSubmits,
    FileComponent,
    InputComponent,
    CalloutComponent,
    GestorDocumentos,
    ErrorComponent,
    TabLayout
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      PlantillaBase,
      new PlantillaBaseController()
    )
    const mixin2 = new ContenedorSimpleMixin(
      PlantillaBase,
      new PlantillaBaseController()
    )
    const { entidad: plantilla, disabled, accion } = mixin.useReferencias()
    const { setValidador, guardar, reestablecer, editar, eliminar, listar } =
      mixin.useComportamiento()
    const {
      onBeforeGuardar,
      onGuardado,
      onConsultado,
      onReestablecer,
      onBeforeModificar,
      onModificado
    } = mixin.useHooks()
    const cargando = new StatusEssentialLoading()

    const metodo = computed(() => {
      switch (accion.value) {
        case acciones.nuevo:
          return 'POST'
        case acciones.editar:
          return 'PUT'
        case acciones.eliminar:
          return 'DELETE'
        default:
          return 'GET'
      }
    })
    /*************
     * HOOKS
     **************/
    onConsultado(() => {
      plantilla.isComponentFilesModified = true
    })
    onGuardado(async () => await listar())
    onModificado(async () => await listar())
    onBeforeModificar(() => (plantilla._method = metodo.value))
    onBeforeGuardar(() => (plantilla._method = metodo.value))
    onReestablecer(() => (plantilla._method = metodo.value))

    /*************
     * Validaciones
     **************/
    const reglas = {
      nombre: { required },
      url: { required }
    }
    const v$ = useVuelidate(reglas, plantilla)
    setValidador(v$.value)

    /*************
     * Funciones
     **************/

    return {
      mixin,
      mixin2,
      v$,
      cargando,
      plantilla,
      disabled,
      accion,
      acciones,
      configuracionColumnas: configuracionColumnasPlantillasBase,
      guardar,
      reestablecer,
      editar,
      eliminar
    }
  }
})
