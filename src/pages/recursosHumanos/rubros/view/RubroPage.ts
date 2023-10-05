// Dependencias
import { configuracionColumnasRubro } from '../domain/configuracionColumnasRubro'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RubroController } from '../infraestructure/RubroController'
import { Rubro } from '../domain/Rubro'
import { removeAccents } from 'shared/utils'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Rubro, new RubroController())
        const { entidad: rubro, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
          nombre_rubro: { required }
        }

        const v$ = useVuelidate(reglas, rubro)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            rubro,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasRubro,
        }
    }
})
