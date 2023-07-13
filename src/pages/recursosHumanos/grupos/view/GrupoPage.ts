// Dependencias
import { configuracionColumnasGrupo } from '../domain/configuracionColumnasGrupo'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GrupoController } from '../infraestructure/GrupoController'
import { Grupo } from '../domain/Grupo'
import { regiones } from 'config/utils'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Grupo,
      new GrupoController()
    )
    const { entidad: grupo, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const rules = {
      nombre: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, grupo)
    setValidador(v$.value)

    return {
      // mixin
      v$,
      mixin,
      grupo,
      disabled,
      accion,
      configuracionColumnasGrupo,
      regiones,
    }
  },
})
