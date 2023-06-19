// Dependencias
import { configuracionColumnasPrestamo } from '../domain/configuracionColumnasPrestamo'
import { configuracionColumnasPlazoPrestamo } from '../domain/configuracionColumnasPlazoPrestamo'
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { apiConfig, endpoints } from 'config/api'
import axios from 'axios'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PrestamoController } from '../infraestructure/PrestamoController'
import { Prestamo } from '../domain/Prestamo'
import { removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha } from 'config/utils'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { FormaPagoController } from 'pages/recursosHumanos/forma_pago/infraestructure/FormaPagoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { integer } from 'vuelidate/lib/validators'
import { number } from 'echarts'

export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Prestamo, new PrestamoController())
    const {
      entidad: prestamo,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador,obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()
    const key_enter = ref(0)
    const motivos = ref([])
    const tipos = ref([
      { id: 1, nombre: 'Prestamo Descuento' },
      { id: 2, nombre: 'Anticipo' },
    ])
    const maximoAPrestar = ref()
    const formas_pago = ref([])
    const esMayorPrestamo = ref(false)
    const empleados = ref([])
    const recursosHumanosStore = useRecursosHumanosStore()
    const sueldo_basico = computed(() => {
      recursosHumanosStore.obtener_sueldo_basico()
      return recursosHumanosStore.sueldo_basico
    })
    /* async function obtenerSueldoBasico() {
      sueldo_basico.value = await recursosHumanosStore.obtener_sueldo_basico()
      await console.log(sueldo_basico.value)
    }*/
    cargarVista(async () => {
      await obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        formas_pago: {
          controller: new FormaPagoController(),
          params: { campos: 'id,nombre' },
        },
      })
      formas_pago.value = listadosAuxiliares.formas_pago
      empleados.value = listadosAuxiliares.empleados
    })
    motivos.value = listadosAuxiliares.motivos

    maximoAPrestar.value = parseInt(sueldo_basico.value) * 2
    //Reglas de validacion
    const reglas = computed(() => ({
      solicitante: { required },
      fecha: { required },
      vencimiento: { required },
      monto: { required },
      valor_utilidad: { requiredIf: requiredIf(prestamo.utilidad != null) },
      plazo: { required, minValue: minValue(1), maxValue: maxValue(12) },
      plazos: { required },
      forma_pago: { required },
    }))
    prestamo.plazos = []
    const plazo_pago = ref({ id: 0, vencimiento: '', plazo: 0 })
    function tabla_plazos() {
      key_enter.value++
      if (key_enter.value >= 1) {
        prestamo.plazos = []
      }
      const valor_cuota = prestamo.monto !== null ? prestamo.monto : 0
      const plazo_prestamo = prestamo.plazo != null ? prestamo.plazo : 0
      const valor_pago = valor_cuota / plazo_prestamo
      if (valor_pago <= 200) {
        for (let index = 1; index <= prestamo.plazo; index++) {
          const plazo = {
            num_cuota: index,
            fecha_pago: calcular_fechas(index, 'meses'),
            valor_a_pagar: (valor_cuota / plazo_prestamo).toFixed(2),
            pago_couta:false
          }
          prestamo.plazos!.push(plazo)
        }
      }
    }
    function calcular_fechas(cuota: number, plazo: string) {
      const day = 1000 * 60 * 60 * 24
      const week = 7 * day
      const month = 4 * week
      const year = 12 * month
      const partes = prestamo.fecha!.split('-')
      const fechaActual = new Date(
        parseInt(partes[2]),
        parseInt(partes[1]) - 1,
        parseInt(partes[0])
      )
      switch (plazo) {
        case 'dias':
          fechaActual.setDate(fechaActual.getDate() + cuota)
          break
        case 'semanas':
          fechaActual.setDate(fechaActual.getTime() + week * cuota)
          break
        case 'meses':
          fechaActual.setDate(30) // Establecer el día 30
          // Incrementar los meses en index-1 para asegurarse de que la fecha sea el último día del mes
          fechaActual.setMonth(fechaActual.getMonth() + cuota - 1)
          break
        case 'anios':
          fechaActual.setDate(fechaActual.getTime() + year * cuota)
          break
      }
      // Formatear la fecha en formato 'YYYY-MM-DD'
      // Obtiene los componentes de la fecha
      const dia =
        fechaActual.getDate() >= 10
          ? fechaActual.getDate()
          : '0' + fechaActual.getDate()
      const mes =
        fechaActual.getMonth() >= 9
          ? fechaActual.getMonth() + 1
          : '0' + (fechaActual.getMonth() + 1) // Los meses en JavaScript se indexan desde 0 (enero es 0)
      const año = fechaActual.getFullYear()
      // Formatea los componentes de la fecha en el nuevo formato
      const fechaFormateada = dia + '-' + mes + '-' + año
      return fechaFormateada
    }
    const v$ = useVuelidate(reglas, prestamo)
    setValidador(v$.value)
    function convertir_fecha(fecha: string) {
      const dateString = fecha
      const dateParts = dateString.split('-')
      const dia = parseInt(dateParts[0])
      const mes = parseInt(dateParts[1]) - 1
      const anio = parseInt(dateParts[2])
      return new Date(anio, mes, dia)
    }
    watchEffect(() => {
      if (prestamo.plazo != null) {
        const valor_cuota = prestamo.monto !== null ? prestamo.monto : 0
        const plazo_prestamo = prestamo.plazo != null ? prestamo.plazo : 0
        const valor_pago = valor_cuota / plazo_prestamo
        if (valor_pago <= 200 &&( prestamo.plazo > 0 && prestamo.plazo <= 12) ){
          tabla_plazos()
          prestamo.vencimiento =
            prestamo.plazos != null
              ? prestamo.plazos[prestamo.plazo - 1].fecha_pago
              : null
          if(prestamo.valor_utilidad != null ){
            recargar_tabla()
          }
        }else{
          if( prestamo.plazo > 0){
            notificarError(
              'Las Coutas no deben exeder al 40% del sueldo del empleado'
            )
          }

        }
      }
    })
    function filtrarEmpleado(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function recargar_tabla() {
      const valor_utilidad =
        prestamo.valor_utilidad == null ? 0 : prestamo.valor_utilidad
      const valor_prestamo = prestamo.monto == null ? 0 : prestamo.monto

      if (valor_utilidad > 0) {
        const indice_couta = prestamo.plazos!.findIndex(
          (couta) => couta.num_cuota === prestamo.plazo + 1
        )
        if (indice_couta == -1) {
          const nuevaCuota = {
            num_cuota: prestamo.plazos!.length + 1,
            fecha_pago:'15-04-'+ prestamo.utilidad ,
            valor_a_pagar: prestamo.valor_utilidad,
            pago_couta:false
          }
          prestamo.plazos!.push(nuevaCuota)
        } else {
          prestamo.plazos![indice_couta].fecha_pago =
          '15-04-'+ prestamo.utilidad
          prestamo.plazos![indice_couta].valor_a_pagar = prestamo.valor_utilidad
        }
        const valorAnterior = valor_prestamo / prestamo.plazo
        calcular_valores_prestamo(valor_utilidad, valor_prestamo, valorAnterior)
      }
    }

    const botonmodificar_couta: CustomActionTable = {
      titulo: 'editar',
      icono: 'bi-pencil-square',
      color: 'secondary',
      accion: ({posicion }) => {
        modificar_couta(posicion)
      },
      visible: ()=> accion.value == "NUEVO"?true:false
    }
    const botonpagar_couta: CustomActionTable = {
      titulo: 'pagar',
      icono: 'bi-cash',
      color: 'primary',
      accion: ({ posicion }) => {
        pagar(posicion)
      },
      visible: ()=> accion.value == "EDITAR"?true:false
    }


    function modificar_couta(indice_couta) {
      confirmar('¿Está seguro de modificar la couta?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Modificar couta',
          mensaje: 'Ingrese nuevo valor de la couta',
          accion: async (data) => {
            try {
              const valor_prestamo = prestamo.monto == null ? 0 : prestamo.monto
              if (data > valor_prestamo) {
                esMayorPrestamo.value = true
              }
              prestamo.plazos![indice_couta].valor_a_pagar = data
              calcular_valores_prestamo_indice(indice_couta, valor_prestamo)
            } catch (e: any) {
              notificarError('No se pudo modificar, debes ingresar monto')
            }
          },
        }
        prompt(data)
      })
    }
    function calcular_valores_prestamo_indice(indiceExcluido, valor_prestamo) {
      const numero_couta = prestamo.plazos![indiceExcluido].num_cuota
      prestamo.plazos!.map((cuotaAnterior) => {
        if (cuotaAnterior.num_cuota !== numero_couta) {
          cuotaAnterior.valor_a_pagar = (
            (parseFloat(valor_prestamo.toString()) -
              prestamo.plazos![indiceExcluido].valor_a_pagar) /
            (prestamo.plazo - 1)
          ).toFixed(2)
          return cuotaAnterior
        }
        return cuotaAnterior
      })
    }


    function calcular_valores_prestamo(
      valor_utilidad,
      valor_prestamo,
      valorAnterior
    ) {
      if (valor_utilidad > 0) {
        let porcentaje_resta
        if (valor_utilidad !== 0) {
          porcentaje_resta =
            parseFloat(valor_utilidad.toString()) /
            parseFloat(valor_prestamo.toString())
        } else {
          // Manejar el caso cuando valor_utilidad es cero
          porcentaje_resta = 0 // Asignar un valor predeterminado o manejarlo de otra forma apropiada
        }
        prestamo.plazos!.slice(0, -1).map((cuotaAnterior) => {
          cuotaAnterior.valor_a_pagar = (
            valorAnterior -
            valorAnterior * porcentaje_resta
          ).toFixed(2)
          return cuotaAnterior
        })
      }
    }
    function pagar(indice_couta){
      confirmar('¿Está seguro de modificar la couta?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Pagar couta',
          mensaje: 'Ingrese valor de la couta a pagar',
          accion: async (data) => {
            try {
              if (data >  prestamo.plazos![indice_couta].valor_a_pagar) {
                notificarError('No se pudo pagar, debes ingresar monto menor o igual a '+ prestamo.plazos![indice_couta].valor_a_pagar)
                return
              }
              prestamo.plazos![indice_couta].pago_couta= true;
              prestamo.plazos![indice_couta].valor_a_pagar =prestamo.plazos![indice_couta].valor_a_pagar- data
            } catch (e: any) {
              notificarError('No se pudo pagar, debes ingresar monto')
            }
          },
        }
        prompt(data)
      })
    }
    return {
      removeAccents,
      mixin,
      prestamo,
      empleados,
      sueldo_basico,
      watchEffect,
      filtrarEmpleado,
      recargar_tabla,
      esMayorPrestamo,
      maximoValorPrestamo: [
        (val) =>
          (val && val <= parseInt(sueldo_basico.value) * 2) ||
          'Solo se permite prestamo menor o igual a 2 SBU (' +
            parseInt(sueldo_basico.value) * 2 +
            ')',
      ],
      botonmodificar_couta,
      botonpagar_couta,
      configuracionColumnasPlazoPrestamo,
      plazo_pago,
      motivos,
      tipos,
      formas_pago,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPrestamo,
      accion,
      accionesTabla,
    }
  },
})
