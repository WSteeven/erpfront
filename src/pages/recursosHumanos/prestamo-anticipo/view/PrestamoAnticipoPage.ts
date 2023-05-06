// Dependencias
import { configuracionColumnasPrestamoAnticipo } from '../domain/configuracionColumnasPrestamoAnticipo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PrestamoAnticipoController } from '../infraestructure/PrestamoAnticipoController'
import { PrestamoAnticipo } from '../domain/PrestamoAnticipo'
import { removeAccents } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      PrestamoAnticipo,
      new PrestamoAnticipoController()
    )
    const {
      entidad: prestamoAnticipo,
      disabled,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()
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
    cargarVista(async () => {
      obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
      })
    })
    motivos.value = listadosAuxiliares.motivos

    //Reglas de validacion
    const reglas = {
      tipo: { required },
      tipo_prestamo: { required },
      fecha: { required },
      vencimiento: { required },
      valor: { required },
      plazos: { required },
      forma_pago: { required },
    }
    const plazo_pago = ref({ id: 0, vencimiento: '', plazo: 0 })
    const filteredTipoPrestamo = computed(() => {
      if (prestamoAnticipo.tipo) {
        return tipos_prestamo.value.filter(
          (item) =>
            item.tipo ===
            parseInt(
              prestamoAnticipo.tipo == null ? '0' : prestamoAnticipo.tipo
            )
        )
      } else {
        return tipos_prestamo.value
      }
    })
    function tabla_plazos() {
      key_enter.value++
      if (key_enter.value >= 1) {
        prestamoAnticipo.plazos = []
      }
     const  valor_cuota = prestamoAnticipo.valor !== null
      ? prestamoAnticipo.valor
      : 0;
      for (let index = 1; index <= prestamoAnticipo.plazo; index++) {
        const plazo = {
          num_cuota: index,
          fecha_pago: calcular_fechas(index, 'meses'),
          valor_a_pagar:
          valor_cuota/ prestamoAnticipo.plazo,
        }

        prestamoAnticipo.plazos!.push(plazo)
      }
    }
    function calcular_fechas(cuota: number, plazo: string) {
      const day = 1000 * 60 * 60 * 24
      const week = 7 * day
      const month = 4 * week
      const year = 12 * month
      const hoy = new Date()
      let fecha
      switch (plazo) {
        case 'dias':
          fecha.value = hoy.getTime() + day * cuota
          break
        case 'semanas':
          fecha = hoy.getTime() + week * cuota
          break
        case 'meses':
          fecha = hoy.getTime() + month * cuota
          break
        case 'anios':
          fecha = hoy.getTime() + year * cuota
          break
      }
      return fecha
    }
    const v$ = useVuelidate(reglas, prestamoAnticipo)
    setValidador(v$.value)
    function diferencia_fechas() {
      //fecha actual
      const fechaActual = new Date()
      const fechaInicio = convertir_fecha(
        prestamoAnticipo.fecha != null
          ? prestamoAnticipo.fecha
          : fechaActual.toString()
      )

      const fechaFin = convertir_fecha(
        prestamoAnticipo.vencimiento != null
          ? prestamoAnticipo.vencimiento
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
      const mes = parseInt(dateParts[1])-1
      const anio = parseInt(dateParts[2])
      return new Date(anio, mes, dia)
    }
    watchEffect(() => {
      prestamoAnticipo.plazo = diferencia_fechas()
      if(prestamoAnticipo.plazo > 0){
        tabla_plazos()
      }

    })
    return {
      removeAccents,
      mixin,
      prestamoAnticipo,
      tipos_prestamo,
      watchEffect,
      filteredTipoPrestamo,
      plazo_pago,
      motivos,
      tipos,
      formas_pago,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPrestamoAnticipo,
    }
  },
})
