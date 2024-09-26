// Dependencias
import { configuracionColumnasTipoEvento } from '../domain/configuracionColumnasTipoEvento'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { TipoEvento } from '../domain/TipoEvento'
import { TipoEventoController } from '../infraestructure/TipoEventoController'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(TipoEvento, new TipoEventoController())
        const { entidad: tipo_evento, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, tipo_evento)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            tipo_evento,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasTipoEvento,
        }
    }
})
