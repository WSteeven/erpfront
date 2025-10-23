// Dependencias
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoActividad } from 'pages/conecel/GestionTareas/tiposActividades/domain/TipoActividad'
import { TipoActividadController } from 'pages/conecel/GestionTareas/tiposActividades/infraestructure/TipoActividadController'
import { configuracionColumnasTiposActividades } from 'pages/conecel/GestionTareas/tiposActividades/domain/configuracionColumnasTiposActividades'
import ErrorComponent from 'components/ErrorComponent.vue';

export default defineComponent({
  components: { ErrorComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoActividad,
      new TipoActividadController()
    )
    const { entidad: tipo_actividad, disabled } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()

    listar()
    //Reglas de validacion
    const reglas = {
      nombre: { required }
    }

    const v$ = useVuelidate(reglas, tipo_actividad)
    setValidador(v$.value)

    return {
      mixin,
      tipo_actividad,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasTiposActividades
    }
  }
})
