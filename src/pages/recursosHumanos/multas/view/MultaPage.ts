// Dependencias
import { configuracionColumnasMulta } from '../domain/configuracionColumnasMulta'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MultaController } from '../infraestructure/MultaController'
import { Multa } from '../domain/Multa'
import { removeAccents } from 'shared/utils'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Multa, new MultaController())
        const { entidad: multa, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required },
            abreviatura: { required }
        }

        const v$ = useVuelidate(reglas, multa)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            multa,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasMulta,
        }
    }
})
