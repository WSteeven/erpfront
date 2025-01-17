import { defineComponent, ref } from 'vue'
import { configuracionColumnasAtrasos } from '../domain/configuracionColumnasAtrasos'
import { useVuelidate } from '@vuelidate/core'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AtrasosController } from '../infraestructure/AtrasosController'
import { Atrasos } from '../domain/Atrasos'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ordenarLista } from 'shared/utils'
import { required } from 'shared/i18n-validators'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { maskFecha } from 'config/utils'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

export default defineComponent({
  name: 'JustificacionPage',
  components: {
    NoOptionComponent,
    SelectorImagen,
    ErrorComponent,
    TabLayoutFilterTabs2,
    OptionGroupComponent,
    EssentialEditor
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Atrasos, new AtrasosController())
    const {
      entidad: atraso,
      listado,
      listadosAuxiliares,
      disabled
    } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const tabDefecto = ref('0') // Por defecto "Justificados"

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        }
      })

      empleados.value = listadosAuxiliares.empleados

    })

    const reglas = {
      empleado: { required },
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
      await listar({ justificado: tab })
    }

    async function sincronizarAtrasos() {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.sincronizar_atrasos)
      try {
        const response: AxiosResponse = await axios.get(url)
        console.log(response.data)
      } catch (error) {
        console.error('Error al sincronizar atrasos:', error)
        listado.value = [] // Mantén el listado vacío si ocurre un error
      }
    }

    sincronizarAtrasos()

    return {
      mixin,
      atraso,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasAtrasos,
      tabDefecto,
      tabOptions,
      maskFecha,

      // opciones
      empleados,
      filtrarEmpleados,

      //funciones
      filtrarListadoAtrasos,
      ordenarLista
    }
  }
})
