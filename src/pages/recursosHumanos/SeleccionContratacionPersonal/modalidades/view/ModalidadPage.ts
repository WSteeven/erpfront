// Dependencias
import { configuracionColumnasModalidades } from '../domain/configuracionColumnasModalidades'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { Modalidad } from '../domain/Modalidad'
import { ModalidadController } from '../infraestructure/ModalidadController'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Modalidad, new ModalidadController())
        const { entidad: modalidad, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required },
        }

        const v$ = useVuelidate(reglas,modalidad)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            modalidad,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasModalidades,
        }
    }
})
