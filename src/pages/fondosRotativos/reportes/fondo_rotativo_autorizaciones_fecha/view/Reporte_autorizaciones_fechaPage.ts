import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { FondoRotativoAutorizacionesFecha } from '../domain/FondoRotativoAutorizacionesFecha'
import { FondoRotativoAutorizacionesFechaController } from '../infrestructure/FondoRotativoAutorizacionesFechaController'
import { maskFecha, tipoReportes } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useCargandoStore } from 'stores/cargando'
import { format } from '@formkit/tempo'
import { required } from 'shared/i18n-validators'

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
      entidad: fondo_rotativo_autorizacion_fecha,
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
      usuario: {
        required
      },
      tipo_reporte: {
        required
      },
      fecha_inicio: {
        required
      },
      fecha_fin: {
        required
      },
    }
    const v$ = useVuelidate(reglas, fondo_rotativo_autorizacion_fecha)
    setValidador(v$.value)
    const usuarios = ref([])
    const usuariosInactivos = ref()
    const tiposFondos = ref([])
    const tiposFondoRotativoFechas = ref([])
    const is_inactivo = ref('false')

    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        tiposFondos: {
          controller: new TipoFondoController(),
          params: { campos: 'id,descripcion' },
        },
      })

      usuarios.value = listadosAuxiliares.usuarios
      usuariosInactivos.value =
        LocalStorage.getItem('usuariosInactivos') == null
          ? []
          : JSON.parse(LocalStorage.getItem('usuariosInactivos')!.toString())
      listadosAuxiliares.usuariosInactivos = usuariosInactivos.value
      tiposFondos.value = listadosAuxiliares.tiposFondos
      tiposFondoRotativoFechas.value =
        listadosAuxiliares.tiposFondoRotativoFechas
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
    // - Filtro TIPOS FONDOS
    function filtrarTiposFondos(val, update) {
      if (val === '') {
        update(() => {
          tiposFondos.value = listadosAuxiliares.tiposFondos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposFondos.value = listadosAuxiliares.tiposFondos.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro TIPOS FONDOS
    function filtrarTiposFondoRotativoFechas(val, update) {
      if (val === '') {
        update(() => {
          tiposFondoRotativoFechas.value =
            listadosAuxiliares.tiposFondoRotativoFechas
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposFondoRotativoFechas.value =
          listadosAuxiliares.tiposFondoRotativoFechas.filter(
            (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
          )
      })
    }
    async function generar_reporte(
      valor: FondoRotativoAutorizacionesFecha,
      tipo: string
    ): Promise<void> {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename =
          'reporte_semanal_gastos_del_' +
          valor.fecha_inicio +
          '_al_' +
          valor.fecha_fin
        switch (tipo) {
          case tipoReportes.EXCEL:
            const url_excel =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(
                endpoints.fondo_rotativo_autorizaciones_fecha_excel
              )
            imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
            break
          case 'pdf':
            const url_pdf =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(
                endpoints.fondo_rotativo_autorizaciones_fecha_pdf
              )
            imprimirArchivo(url_pdf, 'POST', 'blob', 'pdf', filename, valor)
            break
          default:
            break
        }
      }
    }
    fondo_rotativo_autorizacion_fecha.tipo_reporte = '1'
    function optionsFechaFin(date) {
      const fechaActual = format(
        fondo_rotativo_autorizacion_fecha.fecha_inicio !== null
          ? fondo_rotativo_autorizacion_fecha.fecha_inicio
          : new Date(),
        'YYYY/MM/DD'
      )
      return date >= fechaActual
    }
    return {
      mixin,
      fondo_rotativo_autorizacion_fecha,
      disabled,
      accion,
      v$,
      maskFecha,
      usuarios,
      usuariosInactivos,
      tiposFondos,
      tiposFondoRotativoFechas,
      is_inactivo,
      generar_reporte,
      filtrarUsuarios,
      filtrarUsuariosInactivos,
      filtrarTiposFondos,
      filtrarTiposFondoRotativoFechas,
      watchEffect,
      optionsFechaFin,
    }
  },
})
