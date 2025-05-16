// Dependencias
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasTipoEventoBitacora } from '../domain/configuracionColumnasTipoEventoBitacora'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'

// Logica y controladores
import { TipoEventoBitacoraController } from '../infraestructure/TipoEventoBitacoraController'
import { TipoEventoBitacora } from '../domain/TipoEventoBitacora'


export default defineComponent({
  components: { TabLayout, EssentialEditor },
  setup() {
    /**********
     * Stores
     **********/
    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(TipoEventoBitacora, new TipoEventoBitacoraController())
    const { entidad: tipo, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    /*************
     * Variables
     *************/

    /*********
     * Reglas
     *********/
    const rules = {
      nombre: { required },
      descripcion: { required },
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, tipo)
    setValidador(v$.value)

    return {
      v$,
      mixin,
      tipo,
      disabled,
      configuracionColumnasTipoEventoBitacora,
    }
  },
})
