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
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Asistencia,
      new AsistenciaController()
    )
    const { entidad: asistencia, disabled, listado } = mixin.useReferencias()
    console.log('Asistencia inicializada en useReferencias:', asistencia)
    const { setValidador, guardar, listar } = mixin.useComportamiento()
    const { notificarCorrecto } = useNotificaciones()

    const cargando  = new StatusEssentialLoading()

    // Reglas de validación
    const reglas = {
      empleado: { required },
      hora_ingreso: { required },
      hora_salida: { required }
    }

    const v$ = useVuelidate(reglas, asistencia)
    setValidador(v$.value)

    async function actualizarAsistencias() {
      cargando.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.sincronizar_marcaciones)
      try {
        const response: AxiosResponse = await axios.get(url)

        console.log(response.data.message)
        if (response.status === 200) notificarCorrecto(response.data.message)
        await listar()
      } catch (error) {
        console.error('Error al sincronizar asistencias:', error)
        listado.value = [] // Mantén el listado vacío si ocurre un error
      }finally{
        cargando.desactivar()
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
      actualizarAsistencias
    }
  }
})
