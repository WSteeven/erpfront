import { defineComponent, ref } from 'vue'
import { configuracionColumnasJustificacion } from '../domain/configuracionColumnasJustificacion'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { JustificacionController } from '../infraestructure/JustificacionController'
import { Justificacion } from './../domain/Justificacion'

export default defineComponent({
  name: 'JustificacionPage',
  components: { TabLayoutFilterTabs2, EssentialEditor },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Justificacion,
      new JustificacionController()
    )
    const { entidad: justificacion, listado, disabled } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const tabDefecto = ref('0') // Por defecto "Justificados"

    const reglas = {
      justificacion: { required }
    }

    const v$ = useVuelidate(reglas, justificacion)
    setValidador(v$.value)

    const tabOptions = [
      { value: '0', label: 'Injustificados' },
      { value: '1', label: 'Justificados' }
    ]

    async function filtrarListadoAtrasos(tab: string) {
      tabDefecto.value = tab
      if (listado.value.length > 0) listar({ requiere_justificacion: tab })
    }

    async function actualizarAtrasos() {
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.atrasos) +
        '/sincronizar'
      try {
        const response: AxiosResponse = await axios.get(url)
        listado.value = Array.isArray(response.data.results)
          ? response.data.results
          : []
        listar() // Asegúrate de que esta función pueda manejar un arreglo vacío
      } catch (error) {
        console.error('Error al sincronizar atrasos:', error)
        listado.value = [] // Mantén el listado vacío si ocurre un error
      }
    }

    actualizarAtrasos()

    return {
      mixin,
      justificacion,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasJustificacion,
      filtrarListadoAtrasos,
      tabDefecto,
      tabOptions
    }
  }
})
