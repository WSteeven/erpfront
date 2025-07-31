// Dependencias
import { configuracionColumnasPrestamo } from '../domain/configuracionColumnasPrestamo'
import { configuracionColumnasPlazoPrestamo } from '../domain/configuracionColumnasPlazoPrestamo'
import { required, requiredIf } from 'shared/i18n-validators'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PrestamoController } from '../infraestructure/PrestamoController'
import { Prestamo } from '../domain/Prestamo'
import {
  acciones,
  accionesTabla,
  maskFecha,
  tabPrestamoEmpresarial
} from 'config/utils'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'
import { PrestamoCustomController } from '../infraestructure/PrestamoCustomController'
import { useAuthenticationStore } from 'stores/authentication'
import { format, parse } from '@formkit/tempo'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    TabLayoutFilterTabs2,
    SelectorImagen,
    EssentialTable
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Prestamo, new PrestamoController())
    const {
      entidad: prestamo,
      disabled,
      accion,
      listadosAuxiliares,
      listado
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onBeforeModificar, onBeforeConsultar } = mixin.useHooks()

    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError
    } = useNotificaciones()
    const key_enter = ref(0)
    const motivos = ref([])

    /*const tipos = ref([
              { id: 1, nombre: 'Prestamo Descuento' },
              { id: 2, nombre: 'Anticipo' }
            ])*/
    const esConsultado = ref(false)

    onBeforeConsultar(async () => {
      await consultarEmpleados()
    })
    onBeforeModificar(() => (esConsultado.value = true))
    const maximoAPrestar = ref()
    const esMayorPrestamo = ref(false)
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const periodos = ref()
    const recursosHumanosStore = useRecursosHumanosStore()
    const authenticationStore = useAuthenticationStore()

    const sueldo_basico = computed(() => {
      recursosHumanosStore.obtenerSueldoBasico()
      return recursosHumanosStore.sueldo_basico
    })
    const prestamoEmpresarialCustomController = new PrestamoCustomController()

    const esNuevo = computed(() => {
      return accion.value === acciones.nuevo
    })
    cargarVista(async () => {
      await obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 }
        }
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
      plazos: { required }
    }))
    prestamo.plazos = []

    // const plazo_pago = ref({ id: 0, vencimiento: '', plazo: 0 })

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
            id: index - 1,
            num_cuota: index,
            fecha_vencimiento: calcular_fechas(index, 'meses'),
            valor_cuota: (valor_cuota / plazo_prestamo).toFixed(2),
            pago_cuota: false
          }
          prestamo.plazos!.push(plazo)
        }
      }
    }

    async function consultarEmpleados() {
      const { result } = await new EmpleadoController().listar({
        campos: 'id,nombres,apellidos'
      })
      empleados.value = result
      listadosAuxiliares.empleados = result
    }

    function calcular_fechas(cuota: number, plazo: string) {
      const day = 1000 * 60 * 60 * 24
      const week = 7 * day
      const month = 4 * week
      const year = 12 * month
      const fechaPrestamo = parse(
        prestamo.fecha !== null ? prestamo.fecha : new Date().toString(),
        maskFecha
      )
      switch (plazo) {
        case 'dias':
          fechaPrestamo.setDate(fechaPrestamo.getDate() + cuota)
          break
        case 'semanas':
          fechaPrestamo.setDate(fechaPrestamo.getTime() + week * cuota)
          break
        case 'meses':
          fechaPrestamo.setDate(30) // Establecer el día 30
          // Incrementar los meses en index-1 para asegurarse de que la fecha sea el último día del mes
          fechaPrestamo.setMonth(fechaPrestamo.getMonth() + cuota - 1)
          break
        case 'anios':
          fechaPrestamo.setDate(fechaPrestamo.getTime() + year * cuota)
          break
      }
      // Formatear la fecha en formato 'YYYY-MM-DD'
      return format(fechaPrestamo, 'YYYY-MM-DD')
    }

    const v$ = useVuelidate(reglas, prestamo)
    setValidador(v$.value)

    watchEffect(() => {
      try {
        if (accion.value == acciones.nuevo) {
          if (prestamo.plazo != null) {
            const valor_cuota = prestamo.monto !== null ? prestamo.monto : 0
            const plazo_prestamo = prestamo.plazo ?? 0
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
                  'Las cuotas no deben exeder al 40% del sueldo del empleado'
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

    function recargar_tabla() {
      const valor_utilidad =
        prestamo.valor_utilidad == null ? 0 : prestamo.valor_utilidad
      const valor_prestamo = prestamo.monto == null ? 0 : prestamo.monto

      if (valor_utilidad > 0) {
        const indice_cuota = prestamo.plazos!.findIndex(
          cuota => cuota.num_cuota === prestamo.plazo + 1
        )
        if (indice_cuota == -1) {
          const periodo_seleccionado = periodos.value.find(
            periodo => periodo.id === prestamo.periodo
          )

          const nuevaCuota = {
            num_cuota: prestamo.plazos!.length + 1,
            fecha_vencimiento:
              periodo_seleccionado.nombre.split('-')[0] + '-04-15',
            valor_cuota: prestamo.valor_utilidad,
            pago_cuota: false
          }
          prestamo.plazos!.push(nuevaCuota)
        } else {
          //   prestamo.plazos![indice_cuota].fecha_pago ='15-04-' + prestamo.utilidad
          prestamo.plazos![indice_cuota].valor_cuota = prestamo.valor_utilidad
        }
        const valorAnterior = valor_prestamo / prestamo.plazo
        calcular_valores_prestamo(valor_utilidad, valor_prestamo, valorAnterior)
      }
    }

    const btnModificarCuota: CustomActionTable = {
      titulo: 'editar',
      icono: 'bi-pencil-square',
      color: 'secondary',
      accion: ({ posicion }) => {
        console.log(posicion)
        modificarcuota(posicion)
      },
      visible: () => accion.value == 'NUEVO'
    }
    const btnPagarCuota: CustomActionTable = {
      titulo: 'pagar',
      icono: 'bi-cash',
      color: 'primary',
      accion: ({ posicion }) => {
        pagar(posicion)
      },
      visible: () => accion.value == acciones.editar
    }
    const btnAplazarCuota: CustomActionTable = {
      titulo: 'Aplazar',
      icono: 'bi-cash-stack',
      color: 'warning',
      accion: ({ posicion }) => {
        aplazar(posicion)
      },
      visible: () => accion.value == acciones.editar
    }
    const btnEditarTotalCuota: CustomActionTable = {
      titulo: 'Editar Valor a Pagar',
      icono: 'bi-pencil-square',
      color: 'warning',
      accion: ({ posicion }) => {
        modificar_total_cuota(posicion)
      },
      visible: () => accion.value == acciones.editar
    }

    const btnComentario: CustomActionTable = {
      titulo: 'Editar Comentario',
      icono: 'bi-pencil-square',
      color: 'positive',
      accion: ({ posicion }) => {
        modificarComentario(posicion)
      },
      visible: () => accion.value == acciones.editar
    }

    function aplazar(indice_cuota) {
      const fechaActual = prestamo.plazos![prestamo.plazo - 1].fecha_vencimiento
      const [anio, mes, dia] = fechaActual.split('-')
      // Crear un objeto de fecha con el formato yyyy-mm-dd
      const fechaObj = new Date(anio, mes - 1, dia)
      // Aumentar un mes a la fecha de vencimiento
      fechaObj.setMonth(fechaObj.getMonth() + 1)
      // Obtener los componentes de la nueva fecha
      const nuevaFecha = fechaObj.getDate()
      const nuevoMes = fechaObj.getMonth() + 1 // Sumamos 1 ya que los meses van de 0 a 11
      const nuevoAnio = fechaObj.getFullYear()
      // Formatear la nueva fecha a dd-mm-yyyy
      prestamo.plazos![
        indice_cuota
      ].fecha_vencimiento = `${nuevoAnio}-${nuevoMes
        .toString()
        .padStart(2, '0')}-${nuevaFecha.toString().padStart(2, '0')}`
      // prestamo.plazos![indice_cuota].fecha_vencimiento = nuevaFechaStr
    }

    function modificarcuota(indice_cuota) {
      confirmar(
        '¿Está seguro de modificar la cuota N' + (indice_cuota + 1) + '?',
        () => {
          const data: CustomActionPrompt = {
            titulo: 'Modificar cuota',
            mensaje: 'Ingrese nuevo valor de la cuota',
            accion: async data => {
              try {
                const valor_prestamo = prestamo.monto ?? 0 // == null ? 0 : prestamo.monto
                if (data > valor_prestamo) {
                  esMayorPrestamo.value = true
                  notificarAdvertencia(
                    'La suma de todas las cuotas no debe superar al valor del prestamo'
                  )
                }
                prestamo.plazos![indice_cuota].valor_cuota = data
                calcular_valores_prestamo_indice(indice_cuota, valor_prestamo)
              } catch (e: any) {
                notificarError('No se pudo modificar, debes ingresar monto')
              }
            }
          }
          prompt(data)
        }
      )
    }

    function modificarComentario(indice_cuota) {
      const data: CustomActionPrompt = {
        titulo: 'Modificar comentario',
        mensaje: 'Ingrese o modifique el comentario de esta cuota',
        accion: async data => {
          try {
            prestamo.plazos![indice_cuota].comentario = data
          } catch (e: any) {
            notificarError('No se pudo modificar, debes ingresar un comentario')
          }
        }
      }
      prompt(data)
    }

    function modificar_total_cuota(indice_cuota) {
      confirmar('¿Está seguro de modificar la cuota?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Modificar cuota',
          mensaje: 'Ingrese nuevo valor total de la cuota',
          accion: async data => {
            try {
              prestamo.plazos![indice_cuota].valor_a_pagar = data
            } catch (e: any) {
              notificarError('No se pudo modificar, debes ingresar monto')
            }
          }
        }
        prompt(data)
      })
    }

    function calcular_valores_prestamo_indice(indiceExcluido, valor_prestamo) {
      const numero_cuota = prestamo.plazos![indiceExcluido].num_cuota
      prestamo.plazos!.map(cuotaAnterior => {
        if (cuotaAnterior.num_cuota !== numero_cuota) {
          cuotaAnterior.valor_cuota = (
            (parseFloat(valor_prestamo.toString()) -
              prestamo.plazos![indiceExcluido].valor_cuota) /
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
        prestamo.plazos!.slice(0, -1).map(cuotaAnterior => {
          cuotaAnterior.valor_cuota = (
            valorAnterior -
            valorAnterior * porcentaje_resta
          ).toFixed(2)
          return cuotaAnterior
        })
      }
    }

    function pagar(indice_cuota) {
      confirmar('¿Está seguro de pagar la cuota?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Pagar cuota',
          mensaje: 'Ingrese valor de la cuota a pagar',
          accion: async data => {
            try {
              if (
                data > parseFloat(prestamo.plazos![indice_cuota].valor_cuota)
              ) {
                notificarError(
                  'No se pudo pagar, debes ingresar monto menor o igual a ' +
                    prestamo.plazos![indice_cuota].valor_cuota
                )
                return
              }
              const fecha_actual = new Date()
              if (
                data == parseFloat(prestamo.plazos![indice_cuota].valor_cuota)
              ) {
                prestamo.plazos![indice_cuota].pago_cuota = true
                prestamo.plazos![indice_cuota].fecha_pago = fecha_actual
                  .toISOString()
                  .slice(0, 10)
                actualizar_fecha_plazos(indice_cuota + 1)
              }
              prestamo.plazos![indice_cuota].fecha_pago = fecha_actual
                .toISOString()
                .slice(0, 10)
              prestamo.plazos![indice_cuota].valor_pagado = parseFloat(data)
              prestamo.plazos![indice_cuota].valor_a_pagar = (
                prestamo.plazos![indice_cuota].valor_cuota - data
              ).toFixed(2)
            } catch (e: any) {
              notificarError('No se pudo pagar, a ocurido un error: ' + e)
            }
          }
        }
        prompt(data)
      })
    }

    function actualizar_fecha_plazos(indice_cuota) {
      prestamo.plazos!.slice(indice_cuota).forEach(element => {
        const fecha = new Date(element.fecha_vencimiento)
        fecha.setMonth(fecha.getMonth() - 1)
        element.fecha_vencimiento = fecha.toISOString().slice(0, 10)
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
          v => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const btnActualizarPrestamoEmpresarial: CustomActionTable = {
      titulo: 'Actualizar préstamo',
      icono: 'bi-arrow-clockwise',
      color: 'warning',
      tooltip: 'Actualizar el estado del préstamo',
      visible: () =>
        authenticationStore.can('puede.editar.prestamo_empresarial') &&
        tabActualPrestamoEmpresarial == 'ACTIVO',
      accion: ({ entidad}) => {
        actualizarPrestamoEmpresarial(entidad.id)
      }
    }
    const btnEliminarPrestamoEmpresarial: CustomActionTable = {
      titulo: '',
      icono: 'bi-trash',
      color: 'negative',
      visible: () =>
        authenticationStore.can('puede.eliminar.prestamo_empresarial') &&
        tabActualPrestamoEmpresarial == 'ACTIVO',
      accion: ({ entidad, posicion }) => {
        accion.value = 'ELIMINAR'
        eliminar_prestamoempresarial({ entidad, posicion })
      }
    }

    async function actualizarPrestamoEmpresarial(id:number ) {
      try {
        await prestamoEmpresarialCustomController.actualizarPrestamoEmpresarial(id)
        notificarCorrecto('Se ha actualizado  el PrestamoEmpresarial')
        await filtrarPrestamoEmpresarial(tabActualPrestamoEmpresarial)
      } catch (e: any) {
        notificarError(
          'No se pudo actualizar, ocurrio un error'
        )
      }
    }

    async function eliminar_prestamoempresarial({ entidad, posicion }) {
      try {
        const data: CustomActionPrompt = {
          titulo: 'Eliminar PrestamoEmpresarial',
          mensaje: 'Ingrese motivo de eliminacion',
          accion: async data => {
            entidad.estado = false
            entidad.motivo = data
            entidad.descripcion_prestamoempresarial = data
            await prestamoEmpresarialCustomController.anularPrestamoEmpresarial(
              entidad
            )
            notificarCorrecto('Se ha eliminado PrestamoEmpresarial')
            listado.value.splice(posicion, 1)
          }
        }
        prompt(data)
      } catch (e: any) {
        notificarError(
          'No se pudo anular, debes ingresar un motivo para la anulacion'
        )
      }
    }

    let tabActualPrestamoEmpresarial = 'ACTIVO'

    function filtrarPrestamoEmpresarial(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabActualPrestamoEmpresarial = tabSeleccionado
    }

    return {
      mixin,
      prestamo,
      empleados,
      sueldo_basico,
      periodos,
      filtrarEmpleados,
      filtrarPeriodo,
      filtrarPrestamoEmpresarial,
      // esMayorPrestamo,
      // maximoValorPrestamo: [
      //   val =>
      //     (val && val <= parseInt(sueldo_basico.value) * 2) ||
      //     'Solo se permite prestamo menor o igual a 2 SBU (' +
      //       parseInt(sueldo_basico.value) * 2 +
      //       ')'
      // ],
      btnModificarCuota,
      btnPagarCuota,
      btnEditarTotalCuota,
      btnComentario,
      btnAplazarCuota,
      btnEliminarPrestamoEmpresarial,
      btnActualizarPrestamoEmpresarial,
      esNuevo,
      configuracionColumnasPlazoPrestamo,
      maskFecha,
      v$,
      disabled,
      tabPrestamoEmpresarial,
      configuracionColumnas: configuracionColumnasPrestamo,
      accionesTabla
    }
  }
})
