// Dependencias
import { configuracionColumnasHorarioLaboral } from './../domain/configuracionColumnasHorarioLaboral'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { HorarioLaboralController } from '../infraestructure/HorarioLaboralController'
import { HorarioLaboral } from './../domain/HorarioLaboral'
import ErrorComponent from 'components/ErrorComponent.vue'
import { optionsDias, tiposHorariosOptions } from 'config/controlPersonal.utils'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { requiredIf } from 'shared/i18n-validators'

export default defineComponent({
  components: { OptionGroupComponent, ErrorComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      HorarioLaboral,
      new HorarioLaboralController()
    )
    const { entidad: horarioLaboral, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    // Reglas de validación
    const reglas = {
      hora_entrada: { required },
      hora_salida: { required },
      inicio_pausa: { required: requiredIf(()=>horarioLaboral.tiene_pausa) },
      fin_pausa: { required:requiredIf(()=>horarioLaboral.tiene_pausa) },
      nombre: { required },
      dias: { required },
      tipo: { required }
    }

    const v$ = useVuelidate(reglas, horarioLaboral)
    setValidador(v$.value)

    /*************
     * FUNCIONES
     *************/
    function tipoHorarioSeleccionado() {
      horarioLaboral.nombre =
        horarioLaboral.tipo == 'Personalizado' ? null : horarioLaboral.tipo
    }

    return {
      mixin,
      horarioLaboral,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasHorarioLaboral,
      // opciones
      tiposHorariosOptions,
      optionsDias,

      //funciones
      tipoHorarioSeleccionado
    }
  }
})
