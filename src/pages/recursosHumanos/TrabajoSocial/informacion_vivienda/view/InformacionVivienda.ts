import { defineComponent } from 'vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import {
  likertEspaciosFamiliares,
  materiales_predominantes,
  opcionesDistribucion,
  tipos_predominantes,
  tipos_viviendas
} from 'config/trabajoSocial.utils'
import { acciones } from 'config/utils'
import { Vivienda } from 'trabajoSocial/informacion_vivienda/domain/Vivienda'
import useVuelidate from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ServiciosBasicos from 'trabajoSocial/servicios_basicos/view/ServiciosBasicos.vue'

export default defineComponent({
  components: {
    ServiciosBasicos,
    NoOptionComponent,
    ErrorComponent,
    OptionGroupComponent
  },
  props: {
    vivienda: {
      type: Vivienda,
      required: true
    },
    disable: { type: Boolean, default: false },
    accion: { type: String as keyof acciones, default: acciones.nuevo }
  },
  setup(props) {
    const reglas = {
      tipo: { required },
      material_paredes: { required },
      material_techo: { required },
      material_piso: { required },
      distribucion_vivienda: { required },
      numero_dormitorios: { required },
      comodidad_espacio_familiar: { required }
    }

    const v$ = useVuelidate(reglas, props.vivienda)

    return {
      v$,

      //listados
      tipos_viviendas,
      tipos_predominantes,
      likertEspaciosFamiliares,
      opcionesDistribucion,

      //funciones
      obtenerListadoMaterialesPredominantes: tipo => {
        return materiales_predominantes.filter(v => v.tipo == tipo)
      }
    }
  }
})
