import { defineComponent, ref } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { isAxiosError, notificarMensajesError } from 'shared/utils'

import {
  filtarVisualizacionEmpleadosSaldos,
  imprimirArchivo,
} from 'shared/utils'
import { ReporteSaldoActual } from '../domain/ReporteSaldoActual'
import { ReporteSaldoActualController } from '../infrestucture/ReporteSaldoActualController'
import { useAuthenticationStore } from 'stores/authentication'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useCargandoStore } from 'stores/cargando'
import { useRouter } from 'vue-router'
import { UltimoSaldoController } from '../infrestucture/UltimoSaldoController'
import { CortarSaldolController } from '../infrestucture/CortarSaldoController'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { TabLayout },

  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const notificaciones = useNotificaciones()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      ReporteSaldoActual,
      new ReporteSaldoActualController()
    )
    const visualizar_saldo_usuario = ref(false)
    const {
      entidad: reporte_saldo_actual,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const router = useRouter()

    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, reporte_saldo_actual)
    setValidador(v$.value)
    const usuarios = ref()
    // Define el tipo de los elementos en los arreglos
    type Usuario = {
      id: number
      nombres: string
      apellidos: string
    }

    // Define las variables con el tipo adecuado
    const usuariosInactivos = ref()
    const is_all_users = ref('false')
    const is_inactivo = ref('false')
    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos,jefe_id',
            estado: 1,
          },
        },
      })

      usuarios.value = filtarVisualizacionEmpleadosSaldos(
        listadosAuxiliares.usuarios
      )
      listadosAuxiliares.usuarios = usuarios.value
      usuariosInactivos.value =
        LocalStorage.getItem('usuariosInactivos') == null
          ? []
          : JSON.parse(LocalStorage.getItem('usuariosInactivos')!.toString())
      listadosAuxiliares.usuariosInactivos = usuariosInactivos.value
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
    function filtrarUsuariosInactivos(val, update) {
      if (val === '') {
        update(() => {
          usuariosInactivos.value = listadosAuxiliares.usuariosInactivos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        usuariosInactivos.value = listadosAuxiliares.usuariosInactivos.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function mostrarUsuarios() {
      reporte_saldo_actual.usuario = null
    }

    async function generar_reporte(
      valor: ReporteSaldoActual,
      tipo: string
    ): Promise<void> {
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'reporte_saldo_actual' + new Date().getTime()
      switch (tipo) {
        case 'excel':
          const url_excel =
            apiConfig.URL_BASE +
            '/' +
            axios.getEndpoint(endpoints.reporte_saldo_actual_excel)
          imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
          break
        case 'pdf':
          const url_pdf =
            apiConfig.URL_BASE +
            '/' +
            axios.getEndpoint(endpoints.reporte_saldo_actual_pdf)
          imprimirArchivo(url_pdf, 'POST', 'blob', 'pdf', filename, valor)
          break
        default:
          break
      }
    }
    if (store.can('puede.buscar.saldo.usuarios') == false) {
      reporte_saldo_actual.usuario = store.user.id
      visualizar_saldo_usuario.value = true
      saldoAnterior()
    }
    async function saldoAnterior() {
      const ultimo_saldo = new UltimoSaldoController()
      if (reporte_saldo_actual.usuario) {
        const { response } = await ultimo_saldo.consultar(
          reporte_saldo_actual.usuario
        )
        visualizar_saldo_usuario.value = true
        reporte_saldo_actual.saldo_anterior = response.data.saldo_actual
      }
    }
    async function cortar_saldo() {
      try {
        const cortar_saldo = new CortarSaldolController()
        await cortar_saldo.listar()
        router.push('acreditacion-semana')
      } catch (error) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, notificaciones)
        }
      }
    }
    return {
      mixin,
      store,
      reporte_saldo_actual,
      cortar_saldo,
      saldoAnterior,
      disabled,
      accion,
      v$,
      usuarios,
      usuariosInactivos,
      is_all_users,
      is_inactivo,
      mostrarUsuarios,
      generar_reporte,
      filtrarUsuarios,
      filtrarUsuariosInactivos,
      visualizar_saldo_usuario,
    }
  },
})
