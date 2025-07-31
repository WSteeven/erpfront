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
import {encontrarUltimoIdListado, isAxiosError, notificarMensajesError, ordenarLista} from 'shared/utils'
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
import {AxiosError, AxiosResponse} from 'axios'

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
      notificarError,
      notificarAdvertencia
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

    function calcularCantidadCuotasOld() {
      descuento.cuotas = []

      const valorTotal = Number(descuento.valor)
      const cantidadCuotas = Number(descuento.cantidad_cuotas)

      const valorCuotaRedondeada =
        Math.floor((valorTotal / cantidadCuotas) * 100) / 100
      const totalParcial = valorCuotaRedondeada * descuento.cantidad_cuotas
      const diferencia = parseFloat((valorTotal - totalParcial).toFixed(2))

      //Comprobamos si el valor de cuota es mayor a 2 digitos para redondearlo
      const fechaObj = new Date(descuento.mes_inicia_cobro + '-01')
      //Creamos los registros

      for (let i = 0; i < descuento.cantidad_cuotas; i++) {
        const cuota = new CuotaDescuento()
        cuota.num_cuota = i + 1
        cuota.id = descuento.cuotas.length
          ? encontrarUltimoIdListado(descuento.cuotas) + 1
          : 1
        cuota.valor_cuota =
          i === 0
            ? parseFloat(
                (valorCuotaRedondeada + Math.abs(diferencia)).toFixed(2)
              )
            : valorCuotaRedondeada
        cuota.mes_vencimiento = fechaObj.toISOString().slice(0, 7)
        //sumar un mes a la fecha
        fechaObj.setMonth(fechaObj.getMonth() + 1)
        cuota.pagada = false
        descuento.cuotas.push(cuota)
      }
    }

    /*************************************************************************
     * Botones de tabla
     *************************************************************************/
    const btnPagarCuota: CustomActionTable<CuotaDescuento> = {
      titulo: 'Pagar',
      icono: 'bi-cash',
      color: 'secondary',
      accion: ({ entidad }) => {
        // put here some code for action}
        confirmar('¿Está seguro de marcar esta cuota como pagada?', () => {
          entidad.pagada = !entidad.pagada
          notificarCorrecto('¡Cuota marcada como pagada exitosamente!')
        })
      },
      visible: ({ entidad }) =>
        [acciones.nuevo, acciones.editar].includes(accion.value) &&
        !entidad.pagada
    }
    const btnEditarValorCuota: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil-square',
      color: 'secondary',
      accion: () => {
        // put here some code for action
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
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
      accion: ({ entidad }) => {
        confirmar(
          'Se modificará el mes de vencimiento hasta el mes siguiente de la ultima cuota. ¿Está seguro de continuar?',
          () => {
            const ultima_cuota: CuotaDescuento = descuento.cuotas.at(-1)
            // Extraemos el año y mes de la última cuota
            const [year, month] = ultima_cuota.mes_vencimiento
              .split('-')
              .map(Number)
            const fechaObj = new Date(year, month - 1, 1)

            console.log(
              'Fecha antes de modificar:',
              fechaObj.toISOString().slice(0, 7)
            )

            // Sumar un mes a la fecha
            fechaObj.setMonth(fechaObj.getMonth() + 1)

            // Convertimos el resultado nuevamente a formato yyyy-mm
            const nuevoMesVencimiento = fechaObj.toISOString().slice(0, 7)
            console.log('Fecha luego de modificar:', nuevoMesVencimiento)

            // Actualizar mes de vencimiento de la entidad
            entidad.mes_vencimiento = nuevoMesVencimiento
            notificarCorrecto('¡Se aplazó correctamente la cuota!')
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
      btnEditarValorCuota,
      btnComentarioCuota,
      btnAplazarCuota,
      btnPagarCuota,

      barraDefault: [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent']
      ]
    }
  }
})
