// Dependencias
import { configuracionColumnasCondiciones } from '../domain/configuracionColumnasCondiciones'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CondicionController } from '../infraestructure/CondicionController'
import { Condicion } from '../domain/Condicion'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Condicion, new CondicionController())
        const { entidad: condicion, disabled } = mixin.useReferencias()
        const { setValidador, listar } = mixin.useComportamiento()

        listar()
        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, condicion)
        setValidador(v$.value)

        return {
            mixin, condicion, v$, disabled,
            configuracionColumnas: configuracionColumnasCondiciones,
        }
    }
})