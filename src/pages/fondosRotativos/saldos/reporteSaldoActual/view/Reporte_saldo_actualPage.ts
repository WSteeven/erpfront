import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { ReporteSaldoActual } from '../domain/ReporteSaldoActual'
import { ReporteSaldoActualController } from '../infrestucture/ReporteSaldoActualController'

export default defineComponent({
  components: { TabLayout },

  setup() {

    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      ReporteSaldoActual,
      new ReporteSaldoActualController()
    )
    const {
      entidad: reporte_saldo_actual,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista} =
      mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario: {
        required: true,
        minLength: 3,
        maxLength: 50,
      }
    }
    const v$ = useVuelidate(reglas, reporte_saldo_actual)
    setValidador(v$.value)
    const usuarios = ref([])
    const is_all_users= ref('false')
    usuarios.value = listadosAuxiliares.usuarios

    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new UsuarioController(),
          params: { campos: 'id,name' },
        }
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
        const needle = val.toLowerCase();
        usuarios.value = listadosAuxiliares.usuarios.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function mostrarUsuarios() {
      reporte_saldo_actual.usuario = null;
    }
    async function generar_reporte(
      valor: ReporteSaldoActual,
      tipo: string
    ): Promise<void> {
       const axios = AxiosHttpRepository.getInstance()
      const filename = 'reporte_saldo_actual' + new Date().getTime();
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

    return {
      mixin,
      reporte_saldo_actual,
      disabled,
      accion,
      v$,
      usuarios,
      is_all_users,
      mostrarUsuarios,
      generar_reporte,
      filtrarUsuarios,
      watchEffect,
    }
  },
})
