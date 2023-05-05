// Dependencias
import { configuracionColumnasPrestamoAnticipo } from '../domain/configuracionColumnasPrestamoAnticipo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed } from 'vue'

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
    const plazos = ref([{ num_cuota: 0, fecha_pago: null, valor_a_pagar: 0 }])
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
      valor: { required },
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
      if (key_enter.value > 1) {
        plazos.value = []
      }
      for (let index = 1; index <= plazo_pago.value.plazo; index++) {
        const plazo = {
          num_cuota: index,
          fecha_pago: calcular_fechas(index, 'meses'),
          valor_a_pagar:
            prestamoAnticipo.valor !== null
              ? prestamoAnticipo.valor
              : 0 / plazo_pago.value.plazo,
        }

        plazos.value.push(plazo)
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

    return {
      removeAccents,
      mixin,
      prestamoAnticipo,
      tipos_prestamo,
      filteredTipoPrestamo,
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
