//Dependencias
import { configuracionColumnasCombustibles } from '../domain/configuracionColumnasCombustibles';
import { required } from 'shared/i18n-validators';
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue';

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { CombustibleController } from '../infraestructure/CombustibleController';
import { Combustible } from '../domain/Combustible';


export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Combustible, new CombustibleController())
        const { entidad: combustible, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required },
            precio: { required },
        }

        const v$ = useVuelidate(reglas, combustible)
        setValidador(v$.value)

        return {
            mixin, combustible, disabled, v$,
            configuracionColumnas: configuracionColumnasCombustibles,

        }
    }
})