// Dependencias
import { configuracionColumnasConceptoIngreso } from '../domain/configuracionColumnasConceptoIngreso'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CargoController } from '../infraestructure/ConceptoIngresoController'

import { removeAccents } from 'shared/utils'
import { ConceptoIngreso } from '../domain/ConceptoIngreso'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(ConceptoIngreso, new CargoController())
        const { entidad: concepto_ingreso, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, concepto_ingreso)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            concepto_ingreso,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasConceptoIngreso,
        }
    }
})
