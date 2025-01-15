import { defineComponent, ref } from 'vue'
import { configuracionColumnasAtrasos } from '../domain/configuracionColumnasAtrasos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AtrasosController } from '../infraestructure/AtrasosController'
import { Atrasos } from '../domain/Atrasos'

export default defineComponent({
  name: 'JustificacionPage',
  components: { TabLayoutFilterTabs2, EssentialEditor },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Atrasos,
      new AtrasosController()
    )
    const { entidad: atraso, listado, disabled } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const tabDefecto = ref('0') // Por defecto "Justificados"

    const reglas = {
      justificacion: { required }
    }

    const v$ = useVuelidate(reglas, atraso)
    setValidador(v$.value)

    const tabOptions = [
      { value: '0', label: 'Injustificados' },
      { value: '1', label: 'Justificados' }
    ]

    async function filtrarListadoAtrasos(tab: string) {
      tabDefecto.value = tab
      if (listado.value.length > 0) await listar({ requiere_justificacion: tab })
    }

    async function actualizarAtrasos() {
      const axios = AxiosHttpRepository.getInstance()
      const url =apiConfig.URL_BASE +'/'+axios.getEndpoint(endpoints.sincronizar_atrasos)
      try {
        const response: AxiosResponse = await axios.get(url)
        listado.value = Array.isArray(response.data.results)
          ? response.data.results
          : []
       await listar() // Asegúrate de que esta función pueda manejar un arreglo vacío
      } catch (error) {
        console.error('Error al sincronizar atrasos:', error)
        listado.value = [] // Mantén el listado vacío si ocurre un error
      }
    }

    actualizarAtrasos()

    return {
      mixin,
      atraso,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasAtrasos,
      filtrarListadoAtrasos,
      tabDefecto,
      tabOptions
    }
  }
})
