import { computed, defineComponent, reactive, ref } from 'vue';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue';
import { useNotificaciones } from 'shared/notificaciones';
import { useAuthenticationStore } from 'stores/authentication';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { obtenerFechaActual } from 'shared/utils';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';

export default defineComponent({
  name: 'DashboardControlPersonal',
  components: { GraficoGenerico, EssentialTable },
  setup() {
    const dashboard = reactive({ tipo: '', fecha_inicio: '', fecha_fin: '' });
    const store = useAuthenticationStore();
    const notificaciones = useNotificaciones();
    const cargando = new StatusEssentialLoading();
    const opcionesTipos = ref([
      { label: 'Asistencias', value: 'ASISTENCIAS' },
      { label: 'Atrasos', value: 'ATRASOS' }
    ]);
    const totalAsistencias = ref(0);
    const totalAtrasos = ref(0);
    const registros = ref([]);
    const graficos = ref([]);
    const tabs = ref('graficos');
    const modoUnaColumna = ref(true);

    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      tipo: { required }
    };
    const v$ = useVuelidate(reglas, dashboard);

    async function consultar() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar();
          console.log('Consultando datos', dashboard);
          // Simulación de consulta a API
          totalAsistencias.value = Math.floor(Math.random() * 100);
          totalAtrasos.value = Math.floor(Math.random() * 50);

          cargando.desactivar();
        } catch (error) {
          console.error(error);
          cargando.desactivar();
        }
      }
    }

    return {
      dashboard,
      opcionesTipos,
      totalAsistencias,
      totalAtrasos,
      registros,
      graficos,
      tabs,
      modoUnaColumna,
      v$,
      consultar
    };
  }
});
