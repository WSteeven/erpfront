//Dependencias
import { configuracionColumnasTiposFibras } from '../domain/configuracionColumnasTiposFibras'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFibraController } from '../infraestructure/TipoFibraController'
import { TipoFibra } from '../domain/TipoFibra'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(TipoFibra, new TipoFibraController())
        const { entidad: tipoFibra, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        // listar()
        //Reglas de validacion 
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, tipoFibra)
        setValidador(v$.value)

        return {
            mixin, tipoFibra, v$, disabled,
            configuracionColumnas: configuracionColumnasTiposFibras,
        }
    }
})