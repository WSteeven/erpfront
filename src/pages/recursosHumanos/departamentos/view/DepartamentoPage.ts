// Dependencias
import { configuracionColumnasDepartamento } from '../domain/configuracionColumnasDepartamento'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DepartamentoController } from '../infraestructure/DepartamentoController'
import { Departamento } from '../domain/Departamento'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Departamento,
      new DepartamentoController()
    )
    const { entidad: departamento, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const rules = {
      nombre: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, departamento)
    setValidador(v$.value)

    return {
      // mixin
      v$,
      mixin,
      departamento,
      disabled,
      accion,
      configuracionColumnasDepartamento,
    }
  },
})
