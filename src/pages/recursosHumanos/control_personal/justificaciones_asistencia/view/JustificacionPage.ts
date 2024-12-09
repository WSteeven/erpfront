// Dependencias
import { defineComponent } from 'vue';
import { configuracionColumnasJustificacion } from '../domain/configuracionColumnasJustificacion';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { JustificacionController } from '../infraestructure/JustificacionController';
import { Justificacion } from './../domain/Justificacion';

export default defineComponent({
  name: 'JustificacionPage',
  components: { TabLayout },
  props: {
    empleadoData: {
      type: Object,
      required: true,
    },
  },
  setup() {
    // Inicializar mixin y obtener referencias
    const mixin = new ContenedorSimpleMixin(Justificacion, new JustificacionController());
    const { entidad: justificacion, disabled } = mixin.useReferencias();
    const { setValidador } = mixin.useComportamiento();

    // Reglas de validación
    const reglas = {
      justificacion: { required },
    };

    const v$ = useVuelidate(reglas, justificacion);
    setValidador(v$.value);

    // Guardar justificación
    const guardar = () => {
      if (!v$.value.$invalid) {
        console.log('Justificación realizada:', justificacion);
        // Aquí iría la lógica para enviar los datos al backend
      }
    };

    return {
      mixin,
      justificacion,
      v$,
      disabled,
      guardar,
      configuracionColumnas: configuracionColumnasJustificacion,
    };
  },
});
