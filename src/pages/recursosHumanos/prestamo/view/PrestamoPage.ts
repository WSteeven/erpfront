// Dependencias
import { configuracionColumnasPrestamo} from '../domain/configuracionColumnasPrestamo'
import { configuracionColumnasPlazoPrestamo } from '../domain/configuracionColumnasPlazoPrestamo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PrestamoAnticipoController } from '../infraestructure/PrestamoAnticipoController'
import { Prestamo} from '../domain/Prestamo'
import { removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha } from 'config/utils'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'


export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Prestamo,
      new PrestamoAnticipoController()
    )
    const {
      entidad: prestamo,
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
      fecha: { required },
      vencimiento: { required },
      valor: { required },
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
     const  valor_cuota = prestamo.valor !== null
      ? prestamo.valor
      : 0;
      for (let index = 1; index <= prestamo.plazo; index++) {
        const plazo = {
          num_cuota: index,
          fecha_pago: calcular_fechas(index, 'meses'),
          valor_a_pagar:
          valor_cuota/ prestamo.plazo,
        }

        prestamo.plazos!.push(plazo)
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
      const fecha_final = new Date(fecha);
      return fecha_final.toLocaleDateString('es-ES',{day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    }
    const v$ = useVuelidate(reglas, prestamo)
    setValidador(v$.value)
    function diferencia_fechas() {
      //fecha actual
      const fechaActual = new Date()
      const fechaInicio = convertir_fecha(
        prestamo.fecha != null
          ? prestamo.fecha
          : fechaActual.toString()
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
      const mes = parseInt(dateParts[1])-1
      const anio = parseInt(dateParts[2])
      return new Date(anio, mes, dia)
    }
    watchEffect(() => {
      prestamo.plazo = diferencia_fechas()
      if(prestamo.plazo > 0){
        tabla_plazos()
      }

    })
    return {
      removeAccents,
      mixin,
      prestamo,
      tipos_prestamo,
      watchEffect,
      configuracionColumnasPlazoPrestamo,
      plazo_pago,
      motivos,
      tipos,
      formas_pago,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPrestamo,
      accionesTabla
    }
  },
})
