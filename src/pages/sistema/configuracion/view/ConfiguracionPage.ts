//definiciones
import { configuracionColumnasConfiguracionGeneral } from '../domain/configuracionColumnasConfiguracionGeneral'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { defineComponent } from 'vue'
import { ConfiguracionGeneral } from '../domain/Configuracion'
import { ConfiguracionGeneralController } from '../infraestructure/ConfiguracionController'
import useVuelidate from '@vuelidate/core'
import { required } from 'shared/i18n-validators'

export default defineComponent({
    components: { TabLayout, SelectorImagen },
    setup() {
        const mixin = new ContenedorSimpleMixin(ConfiguracionGeneral, new ConfiguracionGeneralController())
        const { entidad: configuracion, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            ruc: { required },
            representante: { required },
            razon_social: { required },

        }
        const v$ = useVuelidate(reglas, configuracion)
        setValidador(v$.value)

        return {
            mixin,
            configuracion, v$, disabled,
            configuracionColumnas: configuracionColumnasConfiguracionGeneral,
        }
    }
})