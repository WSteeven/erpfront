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
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { BonoTrimestralCumplimiento } from '../domain/BonoTrimestralCumplimiento'
import axios, { AxiosResponse } from 'axios'
import { BonoTrimestralCumplimientoController } from '../infrestucture/BonoTrimestralCumplimientoController'

import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { configuracionColumnasBonoTrimestralCumplimiento } from '../domain/configuracionColumnasBonoTrimestralCumplimiento'

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
      BonoTrimestralCumplimiento,
      new BonoTrimestralCumplimientoController()
    )
    const { entidad: bono_trimestral_cumplimiento, accion, disabled } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    const authenticationStore = useAuthenticationStore()

    useCargandoStore().setQuasar(useQuasar())
    const is_month = ref(false)

    const reglas = {
      trimestre: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, bono_trimestral_cumplimiento)
    setValidador(v$.value)

    onGuardado(() => {
      console.log('guardado');

      listar({})
    })
     /**Verifica si es un mes */
     function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
    }
    return {
      removeAccents,
      mixin,
      v$,
      is_month,
      checkValue,
      bono_trimestral_cumplimiento,
      accion,
      disabled,
      maskFecha,
      configuracionColumnas: configuracionColumnasBonoTrimestralCumplimiento,
    }
  },
})
