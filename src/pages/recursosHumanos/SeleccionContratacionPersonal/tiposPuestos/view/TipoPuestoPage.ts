// Dependencias
import { configuracionColumnasTipoPuestoTrabajo } from '../domain/configuracionColumnasTipoPuesto'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { TipoPuesto } from '../domain/TipoPuesto'
import { TipoPuestoController } from '../infraestructure/TipoPuestoController'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(TipoPuesto, new TipoPuestoController())
        const { entidad: tipo, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required },
        }

        const v$ = useVuelidate(reglas,tipo)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            tipo,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasTipoPuestoTrabajo,
        }
    }
})
