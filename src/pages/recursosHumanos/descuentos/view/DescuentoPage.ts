import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Descuento } from 'recursosHumanos/descuentos/domain/Descuento'
import { DescuentoController } from 'recursosHumanos/descuentos/infraestructure/DescuentoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasDescuentos } from 'recursosHumanos/descuentos/domain/configuracionColumnasDescuentos'
import { tabOptionsDescuentos } from 'config/recursosHumanos.utils'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { configuracionColumnasCuotasDescuento } from 'recursosHumanos/descuentos/domain/configuracionColumnasCuotasDescuento'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CuotaDescuento } from 'recursosHumanos/descuentos/domain/CuotaDescuento'
import {
  isAxiosError,
  notificarMensajesError,
  ordenarLista
} from 'shared/utils'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { DescuentosGenralesController } from 'recursosHumanos/descuentos_generales/infraestructure/DescuentosGenralesController'
import { MultaController } from 'recursosHumanos/multas/infraestructure/MultaController'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosError, AxiosResponse } from 'axios'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    EssentialEditor,
    TabLayoutFilterTabs2,
    EssentialTable
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Descuento,
      new DescuentoController()
    )
    const {
      entidad: descuento,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    // const { onBeforeModificar } = mixin.useHooks()
    const {
      prompt,
      confirmar,
      notificarCorrecto,
    } = useNotificaciones()
    const tabDefecto = ref('0')
    const is_month = ref(false)
    const cargando = new StatusEssentialLoading()
    const descuentos_generales = ref([])
    const multas = ref([])
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        },
        descuentos_generales: {
          controller: new DescuentosGenralesController(),
          params: {}
        },
        multas: {
          controller: new MultaController(),
          params: {}
        }
      })
      descuentos_generales.value = listadosAuxiliares.descuentos_generales
      empleados.value = listadosAuxiliares.empleados
      multas.value = listadosAuxiliares.multas
    })
    /*************************************************************************
     * HOOKS
     *************************************************************************/

    /*************************************************************************
     * Validaciones
     *************************************************************************/
    const reglas = {
      empleado: { required },
      fecha_descuento: { required },
      descripcion: { required },
      valor: { required },
      cantidad_cuotas: { required },
      mes_inicia_cobro: { required }
    }
    const v$ = useVuelidate(reglas, descuento)
    setValidador(v$.value)

    /*************************************************************************
     * Funciones
     *************************************************************************/
    async function filtrar(tab: string) {
      tabDefecto.value = tab
      await listar({ pagado: tab })
    }

    /**Verifica si es un mes */
    function checkMes(_, reason) {
      is_month.value = reason !== 'month'
    }

    async function calcularCantidadCuotas() {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.calcular_cuotas_descuento)
        const response: AxiosResponse = await axios.post(ruta, descuento)
        console.log(response)
        if (response.status == 200) notificarCorrecto('Cuotas calculadas')
        descuento.cuotas = response.data.cuotas
      } catch (e) {
        const axiosError = e as AxiosError
        if (isAxiosError(axiosError)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, this.notificaciones)
        }
      } finally {
        cargando.desactivar()
      }
    }

    async function aplazarCuota(entidad, posicion, comentario) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta =
          axios.getEndpoint(endpoints.aplazar_cuota_descuento) + entidad.id
        const response: AxiosResponse = await axios.post(ruta, {
          comentario: comentario
        })
        console.log(response)
        if (response.status == 200) {
          notificarCorrecto(response.data.mensaje)
          descuento.cuotas[posicion] = response.data.cuota
        }
      } catch (e) {
        const axiosError = e as AxiosError
        if (isAxiosError(axiosError)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, this.notificaciones)
        }
      } finally {
        cargando.desactivar()
      }
    }

    const btnComentarioCuota: CustomActionTable<CuotaDescuento> = {
      titulo: 'Comentario',
      icono: 'bi-chat-square-text-fill',
      color: 'primary',
      accion: ({ entidad }) => {
        const data: CustomActionPrompt = {
          titulo: 'Comentario',
          mensaje: 'Escribe el comentario',
          defecto: entidad.comentario,
          accion: data => {
            entidad.comentario = data
          }
        }
        prompt(data)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }
    const btnAplazarCuota: CustomActionTable<CuotaDescuento> = {
      titulo: 'Aplazar',
      icono: 'bi-caret-down-fill',
      color: 'warning',
      accion: ({ entidad, posicion }) => {
        console.log(entidad, posicion)
        confirmar(
          'Se modificará el mes de vencimiento hasta el mes siguiente de la ultima cuota. ¡Esta acción es irreversible! ¿Está seguro de continuar?',
          async () => {
            const data: CustomActionPrompt = {
              titulo: 'Comentario',
              mensaje: 'Escribe el motivo por el vas a aplazar la cuota',
              // defecto: entidad.comentario,
              accion: async data => {
                // entidad.comentario = data
                await aplazarCuota(entidad, posicion, data)
              }
            }
            prompt(data)
          }
        )
      },
      visible: ({ entidad }) =>
        [acciones.nuevo, acciones.editar].includes(accion.value) &&
        !entidad.pagada
    }

    return {
      v$,
      mixin,
      descuento,
      accion,
      acciones,
      accionesTabla,
      disabled,
      configuracionColumnas: configuracionColumnasDescuentos,
      configuracionColumnasCuotasDescuento,
      maskFecha,
      tabDefecto,
      tabOptions: tabOptionsDescuentos,

      is_month,

      // listados
      multas,
      descuentos_generales,
      empleados,
      filtrarEmpleados,

      //funciones
      filtrar,
      checkMes,
      calcularCantidadCuotas,
      ordenarLista,

      //botones de tabla
      btnComentarioCuota,
      btnAplazarCuota,

      barraDefault: [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent']
      ]
    }
  }
})
