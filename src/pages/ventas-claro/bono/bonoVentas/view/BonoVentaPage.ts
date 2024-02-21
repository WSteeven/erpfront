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
import axios, { AxiosResponse } from 'axios'
import { BonoMensualCumplimientoController } from '../infrestucture/BonoVentasController'

import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { BonoVentas } from '../domain/BonoVenta'
import { configuracionColumnasBonoVenta } from '../domain/configuracionColumnasBonoVenta'

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
      BonoVentas,
      new BonoMensualCumplimientoController()
    )
    const { entidad: bono_venta, accion, disabled } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    const authenticationStore = useAuthenticationStore()

    useCargandoStore().setQuasar(useQuasar())
    const is_month = ref(false)

    const reglas = {
      cant_ventas: {
        required: true,
      },
      valor: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, bono_venta)
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
      bono_venta,
      accion,
      disabled,
      maskFecha,
      configuracionColumnas: configuracionColumnasBonoVenta,
    }
  },
})
