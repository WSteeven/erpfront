// Dependencias
import { configuracionColumnasHorarioDeAlmuerzo } from './../domain/configuracionColumnasHorarioDeAlmuerzo';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { defineComponent } from 'vue';

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { HorarioDeAlmuerzoController } from '../infraestructure/HorarioDeAlmuerzoController';
import { HorarioDeAlmuerzo } from './../domain/HorarioDeAlmuerzo';

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(HorarioDeAlmuerzo, new HorarioDeAlmuerzoController());
    const { entidad: horarioDeAlmuerzo, disabled } = mixin.useReferencias();
    const { setValidador } = mixin.useComportamiento();

    // Reglas de validación
    const reglas = {
      horaInicio: { required },
      horaFin: { required },
    };

    const v$ = useVuelidate(reglas, horarioDeAlmuerzo);
    setValidador(v$.value);

    return {
      mixin,
      horarioDeAlmuerzo,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasHorarioDeAlmuerzo,
    };
  },
});
