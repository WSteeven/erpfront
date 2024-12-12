import { defineComponent, ref } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo, obtenerFechaActual } from 'shared/utils'
import { FondoRotativoAutorizacionesFecha } from '../domain/FondoRotativoAutorizacionesFecha'
import { FondoRotativoAutorizacionesFechaController } from '../infrestructure/FondoRotativoAutorizacionesFechaController'
import { maskFecha, tipoReportes } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useCargandoStore } from 'stores/cargando'
import { format } from '@formkit/tempo'
import { required } from 'shared/i18n-validators'
import { EstadoViaticoController } from 'pages/fondosRotativos/reportes/fondo_rotativo_autorizaciones_fecha/infrestructure/EstadoViaticoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      FondoRotativoAutorizacionesFecha,
      new FondoRotativoAutorizacionesFechaController()
    )
    const {
      entidad: reporte,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const {onReestablecer}=mixin.useHooks()


    /*************
     * HOOKS
     **************/
    onReestablecer(()=>
    reporte.fecha_fin =  obtenerFechaActual(maskFecha))
    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario: {
        required
      },
      estado: {
        required
      },
      fecha_inicio: {
        required
      },
      fecha_fin: {
        required
      }
    }
    const v$ = useVuelidate(reglas, reporte)
    setValidador(v$.value)
    const empleadosInactivos = ref()
    const tiposFondos = ref([])
    const tiposFondoRotativoFechas = ref([])
    const is_inactivo = ref(false)
    const estados_viaticos = ref([])
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
            empleados_autorizadores_gasto: 1
          }
        },
        tiposFondos: {
          controller: new TipoFondoController(),
          params: { campos: 'id,descripcion' }
        },
        estados: new EstadoViaticoController()
      })

      empleados.value = listadosAuxiliares.empleados
      empleadosInactivos.value =
        LocalStorage.getItem('usuariosInactivos') == null
          ? []
          : JSON.parse(LocalStorage.getItem('usuariosInactivos')!.toString())
      listadosAuxiliares.usuariosInactivos = empleadosInactivos.value
      tiposFondos.value = listadosAuxiliares.tiposFondos
      tiposFondoRotativoFechas.value =
        listadosAuxiliares.tiposFondoRotativoFechas
      estados_viaticos.value = listadosAuxiliares.estados

      reporte.fecha_fin =  obtenerFechaActual(maskFecha)
    })

    /************************
     * Funciones
     ************************/
    function filtrarUsuariosInactivos(val, update) {
      if (val === '') {
        update(() => {
          empleadosInactivos.value = listadosAuxiliares.usuariosInactivos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleadosInactivos.value = listadosAuxiliares.usuariosInactivos.filter(
          v =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function generar_reporte(tipo: string): Promise<void> {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename =
          'reporte_semanal_gastos_del_' +
          reporte.fecha_inicio +
          '_al_' +
          reporte.fecha_fin
        switch (tipo) {
          case tipoReportes.EXCEL:
            const url_excel =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(
                endpoints.fondo_rotativo_autorizaciones_fecha_excel
              )
            await imprimirArchivo(
              url_excel,
              'POST',
              'blob',
              'xlsx',
              filename,
              reporte
            )
            break
          case 'pdf':
            const url_pdf =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(
                endpoints.fondo_rotativo_autorizaciones_fecha_pdf
              )
            await imprimirArchivo(
              url_pdf,
              'POST',
              'blob',
              'pdf',
              filename,
              reporte
            )
            break
          default:
            break
        }
      }
    }
    function optionsFechaInicio(date) {
      const fecha_actual = format(new Date(), 'YYYY/MM/DD')
      return date <= fecha_actual
    }
    function optionsFechaFin(date) {
      const fecha_actual = format(new Date(), 'YYYY/MM/DD')
      const fecha_inicio = format(
        reporte.fecha_inicio !== null ? reporte.fecha_inicio : new Date(),
        'YYYY/MM/DD'
      )
      return date >= fecha_inicio && date <= fecha_actual
    }

    return {
      reporte,
      disabled,
      v$,
      maskFecha,
      empleados,
      empleadosInactivos,
      is_inactivo,
      estados_viaticos,
      generar_reporte,
      filtrarEmpleados,
      filtrarUsuariosInactivos,
      optionsFechaInicio,
      optionsFechaFin
    }
  }
})
