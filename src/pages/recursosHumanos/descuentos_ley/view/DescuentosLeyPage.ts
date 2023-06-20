// Dependencias
import { configuracionColumnasDescuentosLey } from '../domain/configuracionColumnasDescuentosLey'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DescuentosLeyController } from '../infraestructure/DescuentosLeyController'
import { DescuentosLey } from '../domain/DescuentosLey'
import { removeAccents } from 'shared/utils'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(DescuentosLey, new DescuentosLeyController())
        const { entidad: descuentosley, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, descuentosley)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            descuentosley,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasDescuentosLey,
        }
    }
})
