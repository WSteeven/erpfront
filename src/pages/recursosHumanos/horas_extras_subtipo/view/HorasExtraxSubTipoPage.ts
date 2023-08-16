// Dependencias
import { configuracionColumnasHorasExtrasSubTipo } from '../domain/configuracionColumnasHorasExtrasSubTipo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { HorasExtrasSubTipoController } from '../infraestructure/HorasExtrasSubTipoController'
import { HorasExtrasSubTipo } from '../domain/HorasExtrasSubTipo'
import { removeAccents } from 'shared/utils'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(HorasExtrasSubTipo, new HorasExtrasSubTipoController())
        const { entidad: horasextrassubtipo, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, horasextrassubtipo)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            horasextrassubtipo,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasHorasExtrasSubTipo,
        }
    }
})
