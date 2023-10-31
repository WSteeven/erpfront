// Dependencias
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, Ref, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { imprimirArchivo, removeAccents } from 'shared/utils'
import { acciones, accionesTabla } from 'config/utils'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { PagoComision } from '../domain/PagoComision'
import axios, { AxiosResponse } from 'axios'
import { PagoComisionController } from '../infrestucture/PagoComisionController'

import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { configuracionColumnasPagoComision } from '../domain/configuracionColumnasPagoComision'

export default defineComponent({
  components: {
    TabLayout,
    ModalesEntidad,
    SelectorImagen,
    EssentialTable,
    EssentialTableTabs,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      PagoComision,
      new PagoComisionController()
    )
    const { entidad: pagocomision, accion, disabled } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    const authenticationStore = useAuthenticationStore()

    useCargandoStore().setQuasar(useQuasar())

    const reglas = {
      mes: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, pagocomision)
    setValidador(v$.value)

    onGuardado(() => {
      listar({})
    })
    return {
      removeAccents,
      mixin,
      v$,
      pagocomision,
      accion,
      disabled,
      configuracionColumnas: configuracionColumnasPagoComision,
    }
  },
})
