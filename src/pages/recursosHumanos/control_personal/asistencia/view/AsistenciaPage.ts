// Dependencias
import { configuracionColumnasAsistencia } from './../domain/configuracionColumnasAsistencia';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { defineComponent } from 'vue';

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { AsistenciaController } from '../infraestructure/AsistenciaController';
import { Asistencia } from './../domain/Asistencia';

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Asistencia, new AsistenciaController());
    const { entidad: asistencia, disabled } = mixin.useReferencias();
    const { setValidador } = mixin.useComportamiento();

    // Reglas de validación
    const reglas = {
      empleado: { required },
      horaIngreso: { required }
    };

    const v$ = useVuelidate(reglas, asistencia);
    setValidador(v$.value);

    return {
      mixin,
      asistencia,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasAsistencia,
    };
  }
});
