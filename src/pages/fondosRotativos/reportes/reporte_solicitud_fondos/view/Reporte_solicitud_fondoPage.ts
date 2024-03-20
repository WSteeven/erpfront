import { defineComponent, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { ReporteSolicitudFondosController } from '../infrestucture/ReporteSolicitudFondosController'

import { useAuthenticationStore } from 'stores/authentication'
import { ReporteSolicitudFondos } from '../domain/ReporteSolicitudFondos'
import { maskFecha, tipoReportes } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useCargandoStore } from 'stores/cargando'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { required } from 'shared/i18n-validators'
import { format } from '@formkit/tempo'

export default defineComponent({
  components: { TabLayout },

  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const fondoRotativoStore = useFondoRotativoStore()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      ReporteSolicitudFondos,
      new ReporteSolicitudFondosController()
    )
    const visualizar_saldo_usuario = ref(false)
    const {
      entidad: reporte_solicitud_fondos,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      fecha_inicio: {
        required,
      },
      fecha_fin: {
        required,
      },
    }
    const v$ = useVuelidate(reglas, reporte_solicitud_fondos)
    setValidador(v$.value)
    const usuarios = ref([])
    const is_all_users = ref('false')
    const is_inactivo = ref('false')
    usuarios.value = listadosAuxiliares.usuarios

    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })

      usuarios.value = listadosAuxiliares.usuarios
    })
    /*********
     * Filtros
     **********/
    // - Filtro AUTORIZACIONES ESPECIALES

    function filtrarUsuarios(val, update) {
      if (val === '') {
        update(() => {
          usuarios.value = listadosAuxiliares.usuarios
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        usuarios.value = listadosAuxiliares.usuarios.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function generar_reporte(
      valor: ReporteSolicitudFondos,
      tipo: string
    ): Promise<void> {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename = 'reporte_solicitud_fondos' + new Date().getTime()
        switch (tipo) {
          case tipoReportes.EXCEL:
            const url_excel =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.reporte_solicitud_fondo_excel)
            imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
            break
          case tipoReportes.PDF:
            const url_pdf =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.reporte_solicitud_fondo_pdf)
            imprimirArchivo(url_pdf, 'POST', 'blob', 'pdf', filename, valor)
            break
          default:
            break
        }
      }
    }
    async function mostrarInactivos(val) {
      if (val === 'true') {
        const empleados = (
          await new EmpleadoController().listar({
            campos: 'id,nombres,apellidos',
            estado: 0,
          })
        ).result
        fondoRotativoStore.empleados = empleados
        setTimeout(
          () =>
            setInterval(() => {
              empleados.value = fondoRotativoStore.empleados
              usuarios.value = empleados.value
            }, 100),
          250
        )
      } else {
        const empleados_aux = listadosAuxiliares.usuarios
        fondoRotativoStore.empleados = empleados_aux
        setTimeout(
          () =>
            setInterval(() => {
              empleados_aux.value = fondoRotativoStore.empleados
              usuarios.value = empleados_aux.value
            }, 100),
          250
        )
      }
    }
    function optionsFechaFin(date) {
      const fechaActual = format(
        reporte_solicitud_fondos.fecha_inicio !== null
          ? reporte_solicitud_fondos.fecha_inicio
          : new Date(),
        'YYYY/MM/DD'
      )
      return date >= fechaActual
    }
    return {
      mixin,
      store,
      maskFecha,
      reporte_solicitud_fondos,
      disabled,
      accion,
      v$,
      usuarios,
      mostrarInactivos,
      is_inactivo,
      is_all_users,
      generar_reporte,
      filtrarUsuarios,
      visualizar_saldo_usuario,
      watchEffect,
      optionsFechaFin,
    }
  },
})
