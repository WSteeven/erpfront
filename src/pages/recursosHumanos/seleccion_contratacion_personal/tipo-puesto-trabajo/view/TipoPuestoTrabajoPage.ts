// Dependencias
import { configuracionColumnasTipoPuestoTrabajo } from '../domain/configuracionColumnasTipoPuestoTrabajo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoPuestoTrabajoController } from '../infraestructure/TipoPuestoTrabajoController'
import { TipoPuestoTrabajo } from '../domain/TipoPuestoTrabajo'
import { removeAccents } from 'shared/utils'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(TipoPuestoTrabajo, new TipoPuestoTrabajoController())
        const { entidad: tipo_puesto_trabajo, disabled } = mixin.useReferencias()
        const { setValidador } = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
          nombre: { required },
        }

        const v$ = useVuelidate(reglas, tipo_puesto_trabajo)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            tipo_puesto_trabajo,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasTipoPuestoTrabajo,
        }
    }
})
