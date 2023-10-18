import { defineComponent } from 'vue'
import { ValorAcreditar } from '../domain/ValorAcreditar'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValorAcreditarController } from '../infrestructure/ValorAcreditarController'
import { configuracionColumnasValorAcreditar } from '../domain/configuracionColumnasValorAcreditar'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAcreditacionesStore } from 'stores/acreditaciones'


export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
    * Stores
    *********/
    useNotificacionStore().setQuasar(useQuasar())
    const acreditacionesStore = useAcreditacionesStore()

    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(ValorAcreditar, new ValorAcreditarController())
    const {
      consultar,
    } = mixin.useComportamiento()
    const { entidad: valorAcreditar, disabled, accion } = mixin.useReferencias()
    if (acreditacionesStore.idAcreditacionSeleccionada) {
      consultar({ id: acreditacionesStore.idAcreditacionSeleccionada })
    }
    const botonModificarAcreditacion: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'indigo',
      accion: ({ entidad }) => {
        //acreditacionesStore.idAcreditacion = entidad.id
      },
    }
    return {
      mixin,
      valorAcreditar,
      configuracionColumnas: configuracionColumnasValorAcreditar,
      configuracionColumnasValorAcreditar,
      botonModificarAcreditacion
    }
  }
})


