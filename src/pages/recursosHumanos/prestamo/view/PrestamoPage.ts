// Dependencias
import { configuracionColumnasPrestamo } from '../domain/configuracionColumnasPrestamo'
import { configuracionColumnasPlazoPrestamo } from '../domain/configuracionColumnasPlazoPrestamo'
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect } from 'vue'

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

export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Prestamo, new PrestamoController())
    const {
      entidad: prestamo,
      disabled,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
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
    const formas_pago = ref([
      { id: 1, nombre: 'Efectivo' },
      { id: 2, nombre: 'Cheque' },
      { id: 3, nombre: 'Nota Debito' },
    ])
    const tipos_prestamo = ref([
      { id: 1, nombre: 'Prestamo Empresa', tipo: 1 },
      { id: 2, nombre: 'Anticipo de Sueldo de empleado', tipo: 2 },
      { id: 2, nombre: 'Anticipo de Prestamo quirorafario', tipo: 2 },
    ])
    const esMayorPrestamo = ref(false)
    const empleados = ref([])
    cargarVista(async () => {
      obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
    })
    motivos.value = listadosAuxiliares.motivos

    //Reglas de validacion
    const reglas = {
      empleado: { required },
      fecha: { required },
      vencimiento: { required },
      valor: { required },
      valor_utilidad: { required },
      plazos: { required },
      forma_pago: { required },
    }
    prestamo.plazos = []
    const plazo_pago = ref({ id: 0, vencimiento: '', plazo: 0 })
    function tabla_plazos() {
      key_enter.value++
      if (key_enter.value >= 1) {
        prestamo.plazos = []
      }
      const valor_cuota = prestamo.valor !== null ? prestamo.valor : 0
      for (let index = 1; index <= prestamo.plazo; index++) {
        const plazo = {
          num_cuota: index,
          fecha_pago: calcular_fechas(index, 'meses'),
          valor_a_pagar: (valor_cuota / prestamo.plazo).toFixed(2),
        }
        prestamo.plazos!.push(plazo)
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
      const fechaFormateada = fechaActual.toISOString().slice(0, 10)
      return fechaFormateada
    }

    const v$ = useVuelidate(reglas, prestamo)
    setValidador(v$.value)
    function diferencia_fechas() {
      //fecha actual
      const fechaActual = new Date()
      const fechaInicio = convertir_fecha(
        prestamo.fecha != null ? prestamo.fecha : fechaActual.toString()
      )

      const fechaFin = convertir_fecha(
        prestamo.vencimiento != null
          ? prestamo.vencimiento
          : fechaActual.toString()
      )
      const anios = fechaFin.getFullYear() - fechaInicio.getFullYear()
      const meses = fechaFin.getMonth() - fechaInicio.getMonth()
      const totalMeses = anios * 12 + meses
      return totalMeses
    }
    function convertir_fecha(fecha: string) {
      const dateString = fecha
      const dateParts = dateString.split('-')
      const dia = parseInt(dateParts[0])
      const mes = parseInt(dateParts[1]) - 1
      const anio = parseInt(dateParts[2])
      return new Date(anio, mes, dia)
    }
    watchEffect(() => {
      prestamo.plazo = diferencia_fechas()
      if (prestamo.plazo > 0) {
        tabla_plazos()
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
      const valor_prestamo = prestamo.valor == null ? 0 : prestamo.valor

      if (valor_utilidad > 0) {
        const indice_couta = prestamo.plazos!.findIndex(
          (couta) => couta.num_cuota === prestamo.plazo + 1
        )
        if (indice_couta == -1) {
          const nuevaCuota = {
            num_cuota: prestamo.plazos!.length + 1,
            fecha_pago: prestamo.utilidad + '-04-15',
            valor_a_pagar: prestamo.valor_utilidad,
          }
          prestamo.plazos!.push(nuevaCuota)
        } else {
          prestamo.plazos![indice_couta].fecha_pago =
            prestamo.utilidad + '-04-15'
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
      accion: ({ entidad, posicion }) => {
        modificar_couta(posicion)
      },
    }

    function modificar_couta(indice_couta) {
      confirmar('¿Está seguro de modificar la couta?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Modificar couta',
          mensaje: 'Ingrese nuevo valor de la couta',
          accion: async (data) => {
            try {
              const valor_prestamo = prestamo.valor == null ? 0 : prestamo.valor
              if (data > valor_prestamo) {
                esMayorPrestamo.value=true;
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
    watchEffect(() => {
      recargar_tabla()
    })
    return {
      removeAccents,
      mixin,
      prestamo,
      empleados,
      tipos_prestamo,
      watchEffect,
      filtrarEmpleado,
      recargar_tabla,
      esMayorPrestamo,
      botonmodificar_couta,
      configuracionColumnasPlazoPrestamo,
      plazo_pago,
      motivos,
      tipos,
      formas_pago,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPrestamo,
      accionesTabla,
    }
  },
})
