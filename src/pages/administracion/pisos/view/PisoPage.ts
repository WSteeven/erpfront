// Dependencias
import { configuracionColumnasPisos } from '../domain/configuracionColumnasPisos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PisoController } from '../infraestructure/PisoController'
import { Piso } from '../domain/Piso'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Piso, new PisoController())
        const { entidad: piso, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            fila: { required },
        }

        const v$ = useVuelidate(reglas, piso)
        setValidador(v$.value)

        return {
            mixin, piso, v$, disabled,
            configuracionColumnas: configuracionColumnasPisos,
        }
    }
})