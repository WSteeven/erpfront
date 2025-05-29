import { defineComponent, ref } from 'vue'
import { required } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlantillaBase } from 'sistema/plantillasBase/domain/PlantillaBase'
import { PlantillaBaseController } from 'sistema/plantillasBase/infraestructure/PlantillaBaseController'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { useVuelidate } from '@vuelidate/core'
import { acciones } from 'config/utils'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { endpoints } from 'config/api'
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
    const { setValidador,guardar,reestablecer,editar,eliminar, listar } = mixin.useComportamiento()
    const { onGuardado, onConsultado, onModificado } = mixin.useHooks()
    const refArchivo = ref()
    const cargando = new StatusEssentialLoading()
    /*************
     * HOOKS
     **************/
    onGuardado(async id => {
      await subirArchivos(id)
      await listar()
    })
    onConsultado(() => {
      plantilla.isComponentFilesModified = true
    })
    onModificado(async id => {
      await subirArchivos(id)
      await listar()
    })

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
    async function subirArchivos(id: number | undefined) {
      if (id !== undefined) await refArchivo.value.subir({ id })
    }

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
      endpoint: endpoints.plantillas_base_file,
      guardar,reestablecer,editar,eliminar,

      refArchivo
    }
  }
})
