// Dependencias
import { configuracionColumnasCargos } from '../domain/configuracionColumnasCargos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CargoController } from '../infraestructure/CargoController'
import { Cargo } from '../domain/Cargo'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Cargo, new CargoController())
        const { entidad: cargo, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, cargo)
        setValidador(v$.value)



        return {
            mixin,
            cargo,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasCargos,
        }
    }
})
