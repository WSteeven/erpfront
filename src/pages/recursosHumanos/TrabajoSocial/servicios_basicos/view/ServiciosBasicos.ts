import { defineComponent } from 'vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { ServicioBasico } from 'trabajoSocial/servicios_basicos/domain/ServicioBasico'
import { optionsServiciosBasicos } from 'config/trabajoSocial.utils'
import useVuelidate from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import ErrorComponent from 'components/ErrorComponent.vue'

export default defineComponent({
  components: { ErrorComponent, OptionGroupComponent },
  props: {
    servicio_basico: { type: ServicioBasico, required: true },
    disable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const reglas = {
      luz: { required },
      agua: { required },
      telefono: { required },
      internet: { required },
      cable: { required },
      servicios_sanitarios: { required }
    }
    const v$ = useVuelidate(reglas, props.servicio_basico)
    return { v$, optionsServiciosBasicos }
  }
})
