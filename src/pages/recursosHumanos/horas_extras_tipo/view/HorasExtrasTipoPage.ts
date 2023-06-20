// Dependencias
import { configuracionColumnasHorasExtrasTipo } from '../domain/configuracionColumnasHorasExtrasTipo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { HorasExtrasTipoController } from '../infraestructure/HorasExtrasTipoController'
import { HorasExtrasTipo } from '../domain/HorasExtrasTipo'
import { removeAccents } from 'shared/utils'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(HorasExtrasTipo, new HorasExtrasTipoController())
        const { entidad: horasextrastipo, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, horasextrastipo)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            horasextrastipo,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasHorasExtrasTipo,
        }
    }
})
