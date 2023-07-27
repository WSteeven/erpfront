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
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'


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
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const { onBeforeConsultar, onConsultado, onBeforeModificar } =
      mixin.useHooks()
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
    const esConsultado = ref(false)
    onBeforeModificar(() => (esConsultado.value = true))
    const maximoAPrestar = ref()
    const esMayorPrestamo = ref(false)
    const empleados = ref([])
    const periodos = ref()
    const recursosHumanosStore = useRecursosHumanosStore()
    const sueldo_basico = computed(() => {
      recursosHumanosStore.obtener_sueldo_basico()
      return recursosHumanosStore.sueldo_basico
    })
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    cargarVista(async () => {
      await obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
      periodos.value = listadosAuxiliares.periodos
      motivos.value = listadosAuxiliares.motivos
    })

    maximoAPrestar.value = parseInt(sueldo_basico.value) * 2
    //Reglas de validacion
    const reglas = computed(() => ({
      solicitante: { required },
      fecha: { required },
      vencimiento: { required },
      monto: { required },
      valor_utilidad: { requiredIf: requiredIf(prestamo.periodo != null) },
      plazo: { required, minValue: minValue(1), maxValue: maxValue(12) },
      plazos: { required },
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
            fecha_vencimiento: calcular_fechas(index, 'meses'),
            valor_a_pagar: (valor_cuota / plazo_prestamo).toFixed(2),
            pago_couta: false,
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
      try {
        if (accion.value == 'NUEVO' ? true : false) {
          if (prestamo.plazo != null) {
            const valor_cuota = prestamo.monto !== null ? prestamo.monto : 0
            const plazo_prestamo = prestamo.plazo != null ? prestamo.plazo : 0
            const valor_pago = valor_cuota / plazo_prestamo
            if (
              valor_pago <= 200 &&
              prestamo.plazo > 0 &&
              prestamo.plazo <= 12
            ) {
              tabla_plazos()
              prestamo.vencimiento =
                prestamo.plazos != null
                  ? prestamo.plazos[prestamo.plazo - 1].fecha_vencimiento
                  : null
              if (prestamo.valor_utilidad != null) {
                recargar_tabla()
              }
            } else {
              if (prestamo.plazo > 0) {
                notificarError(
                  'Las Coutas no deben exeder al 40% del sueldo del empleado'
                )
              }
            }
          }
        } else {
          prestamo.vencimiento =
            prestamo.plazos != null
              ? prestamo.plazos[prestamo.plazo - 1].fecha_vencimiento
              : null
        }
      } catch (error) {}
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
           // fecha_pago: '15-04-' + prestamo.utilidad,
            valor_a_pagar: prestamo.valor_utilidad,
            pago_couta: false,
          }
          prestamo.plazos!.push(nuevaCuota)
        } else {
       //   prestamo.plazos![indice_couta].fecha_pago ='15-04-' + prestamo.utilidad
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
      accion: ({ posicion }) => {
        modificar_couta(posicion)
      },
      visible: () => (accion.value == 'NUEVO' ? true : false),
    }
    const botonpagar_couta: CustomActionTable = {
      titulo: 'pagar',
      icono: 'bi-cash',
      color: 'primary',
      accion: ({ posicion }) => {
        pagar(posicion)
      },
      visible: () => (accion.value == 'EDITAR' ? true : false),
    }
    const botonaplazar_couta: CustomActionTable = {
      titulo: 'Aplazar',
      icono: 'bi-cash-stack',
      color: 'warning',
      accion: ({ posicion }) => {
        aplazar(posicion)
      },
      visible: () => (accion.value == 'EDITAR' ? true : false),

    }
    function aplazar(indice_couta){
        prestamo.plazos![indice_couta].fecha_vencimiento = prestamo.plazos![(prestamo.plazo-1)].fecha_vencimiento
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
    function pagar(indice_couta) {
      confirmar('¿Está seguro de pagar la couta?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Pagar couta',
          mensaje: 'Ingrese valor de la couta a pagar',
          accion: async (data) => {
            try {
              if (
                data > parseFloat(prestamo.plazos![indice_couta].valor_a_pagar)
              ) {
                notificarError(
                  'No se pudo pagar, debes ingresar monto menor o igual a ' +
                    prestamo.plazos![indice_couta].valor_a_pagar
                )
                return
              }
              const fecha_actual = new Date()
              if (
                data == parseFloat(prestamo.plazos![indice_couta].valor_a_pagar)
              ) {
                prestamo.plazos![indice_couta].pago_couta = true
                prestamo.plazos![indice_couta].fecha_pago = fecha_actual.toISOString().slice(0, 10)
                actualizar_fecha_plazos(indice_couta + 1)
              }
              prestamo.plazos![indice_couta].fecha_pago = fecha_actual.toISOString().slice(0, 10)
              prestamo.plazos![indice_couta].valor_a_pagar = (
                prestamo.plazos![indice_couta].valor_a_pagar - data
              ).toFixed(2)
            } catch (e: any) {
              notificarError('No se pudo pagar, a ocurido un error: ' + e)
            }
          },
        }
        prompt(data)
      })
    }
    function actualizar_fecha_plazos(indice_couta) {
      prestamo.plazos!.slice(indice_couta).forEach((element) => {
        const fecha = new Date(element.fecha_vencimiento)
        fecha.setMonth(fecha.getMonth() - 1)
        element.fecha_vencimiento= fecha.toISOString().slice(0, 10)
      })
    }
       /**
     * La función `filtrarPeriodo` filtra una lista de períodos en función de un valor dado y actualiza la
     * lista filtrada.
     * @param val - El parámetro `val` es un valor de cadena que representa el valor de entrada para
     * filtrar los períodos. Se utiliza para buscar períodos que tienen un nombre que contiene el valor de
     * entrada.
     * @param update - El parámetro `update` es una función que se utiliza para actualizar el valor de
     * `periodos`. Es una función de devolución de llamada que toma otra función como argumento. La función
     * interna es responsable de actualizar el valor de `periodos` en función del parámetro `val` dado.
     * @returns nada (indefinido).
     */
       function filtrarPeriodo(val, update) {
        if (val === '') {
          update(() => {
            periodos.value = listadosAuxiliares.periodos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          periodos.value = listadosAuxiliares.periodos.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
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

      botonaplazar_couta,
      esNuevo,
      configuracionColumnasPlazoPrestamo,
      esConsultado,
      plazo_pago,
      motivos,
      tipos,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPrestamo,
      accion,
      accionesTabla,
    }
  },
})
