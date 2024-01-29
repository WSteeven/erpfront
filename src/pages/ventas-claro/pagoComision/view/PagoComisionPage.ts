// Dependencias
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { convertir_fecha_guion, maskFecha, } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { PagoComision } from '../domain/PagoComision'
import { PagoComisionController } from '../infrestucture/PagoComisionController'

import { configuracionColumnasPagoComision } from '../domain/configuracionColumnasPagoComision'

export default defineComponent({
  components: { TabLayout, ModalesEntidad, SelectorImagen, EssentialTable, EssentialTableTabs, },
  setup() {
    const mixin = new ContenedorSimpleMixin(PagoComision, new PagoComisionController())
    const { entidad: pagocomision, accion, disabled } = mixin.useReferencias()
    const { setValidador} = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    const store = useAuthenticationStore()

    useCargandoStore().setQuasar(useQuasar())

    const reglas = {
      fecha_inicio: { required, },
      fecha_fin: { required, },
    }
    const v$ = useVuelidate(reglas, pagocomision)
    setValidador(v$.value)

    onGuardado(() => {
      console.log('guardado')
    })

    function optionsFechaFin(date) {
      const currentDate =
        pagocomision.fecha_inicio != null
          ? convertir_fecha_guion(pagocomision.fecha_inicio)
          : new Date() // Obtener la fecha actual

      return date > currentDate
    }
    return {
      removeAccents,
      mixin,
      v$,
      pagocomision,
      accion,
      disabled,
      maskFecha,
      optionsFechaFin,
      configuracionColumnas: configuracionColumnasPagoComision,
    }
  },
})
