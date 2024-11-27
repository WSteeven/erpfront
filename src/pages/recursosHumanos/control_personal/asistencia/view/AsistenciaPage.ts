// Dependencias
import { configuracionColumnasAsistencia } from './../domain/configuracionColumnasAsistencia'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AsistenciaController } from '../infraestructure/AsistenciaController'
import { Asistencia } from './../domain/Asistencia'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Asistencia,
      new AsistenciaController()
    )
    const { entidad: asistencia, listado } = mixin.useReferencias()
    console.log('Asistencia inicializada en useReferencias:', asistencia)
    const { setValidador, guardar } = mixin.useComportamiento()

    // Reglas de validación
    const reglas = {
      empleado: { required },
      hora_ingreso: { required },
      hora_salida: { required }
    }

    const v$ = useVuelidate(reglas, asistencia)
    setValidador(v$.value)

    async function actualizarAsistencias() {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE +'/'+axios.getEndpoint(endpoints.asistencia)+'/sincronizar'
      const response: AxiosResponse = await axios.get(url)
      listado.value = []
      listado.value.push(response.data.results)
    }
    return {
      mixin,
      asistencia,
      v$,
      configuracionColumnas: configuracionColumnasAsistencia,
      guardar,
      //funciones
      actualizarAsistencias
    }
  }
})
