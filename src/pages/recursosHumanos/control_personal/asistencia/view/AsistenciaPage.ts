// Dependencias
import { configuracionColumnasAsistencia } from './../domain/configuracionColumnasAsistencia'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AsistenciaController } from '../infraestructure/AsistenciaController'
import { Asistencia } from './../domain/Asistencia'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Asistencia,new AsistenciaController())
    const { entidad: asistencia, disabled, listado } = mixin.useReferencias()
        console.log('Asistencia inicializada en useReferencias:', asistencia)
    const { setValidador, guardar, listar } = mixin.useComportamiento()

    // Reglas de validación
    const reglas = {
      empleado: { required },
      hora_ingreso: { required },
      hora_salida: { required }
    }

    const v$ = useVuelidate(reglas, asistencia)
    setValidador(v$.value)

    async function actualizarAsistencias() {
      const axios = AxiosHttpRepository.getInstance();
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.asistencias) + '/sincronizar';
      try {
        const response: AxiosResponse = await axios.get(url);
        listado.value = Array.isArray(response.data.results) ? response.data.results : [];
        listar(); // Asegúrate de que esta función puede manejar un arreglo vacío
      } catch (error) {
        console.error('Error al sincronizar asistencias:', error);
        listado.value = []; // Mantén el listado vacío si ocurre un error
      }
    }

    actualizarAsistencias()

    return {
      mixin,
      asistencia,
      disabled,
      listado,
      v$,
      configuracionColumnas: configuracionColumnasAsistencia,
      guardar,
      //funciones
      actualizarAsistencias,
    }
  }
})
