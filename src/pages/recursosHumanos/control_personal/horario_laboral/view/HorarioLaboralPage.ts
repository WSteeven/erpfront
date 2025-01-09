// Dependencias
import { configuracionColumnasHorarioLaboral } from './../domain/configuracionColumnasHorarioLaboral';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { defineComponent } from 'vue';

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { HorarioLaboralController } from '../infraestructure/HorarioLaboralController';
import { HorarioLaboral } from './../domain/HorarioLaboral';

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(HorarioLaboral, new HorarioLaboralController());
    const { entidad: horarioLaboral, disabled } = mixin.useReferencias();
    const { setValidador } = mixin.useComportamiento();

    const tipoHorarioOptions = [
      { label: 'Laboral', value: 'laboral' },
      { label: 'Almuerzo', value: 'almuerzo' },
    ];

    // Reglas de validación
    const reglas = {
      hora_entrada: { required },
      hora_salida: { required },
      tipo_horario: { required },
    };

    const v$ = useVuelidate(reglas, horarioLaboral);
    setValidador(v$.value);

    return {
      mixin,
      horarioLaboral,
      v$,
      disabled,
      tipoHorarioOptions,
      configuracionColumnas: configuracionColumnasHorarioLaboral,
    };
  },
});
