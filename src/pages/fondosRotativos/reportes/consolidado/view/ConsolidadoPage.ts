import { defineComponent, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { Consolidado } from '../domain/Consolidado'
import { ConsolidadoController } from '../infrestructure/ConsolidadoController'
import { maskFecha, tipoReportes, tipo_saldo, tipos_saldos } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useCargandoStore } from 'stores/cargando'
import { required } from 'shared/i18n-validators'
import  {addDay, format, monthStart } from '@formkit/tempo'

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
    const mixin = new ContenedorSimpleMixin(Consolidado, new ConsolidadoController())
    const { entidad: consolidado, disabled, accion, listadosAuxiliares, } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      tipo_saldo: {
        required,
      },
      fecha_inicio: {
        required,
      },
      fecha_fin: {
        required,
      },
    }

    const is_all_empleados = ref('false')
    const is_inactivo = ref('false')
    const tipos_saldos_consolidado = ref()
    tipos_saldos_consolidado.value = tipos_saldos
    listadosAuxiliares.tipos_saldos = tipos_saldos_consolidado
    const v$ = useVuelidate(reglas, consolidado)
    setValidador(v$.value)
    const usuarios = ref([])
    const usuariosInactivos = ref()
    const tiposFondos = ref([])
    const tiposFondoRotativoFechas = ref([])
    usuarios.value = listadosAuxiliares.usuarios

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
 

        const primerDiaMes = monthStart(new Date())
        const ultimoDiaMesAnterior = addDay(primerDiaMes, -1)
        const primerDiaMesAnterior = monthStart(ultimoDiaMesAnterior)

        consolidado.fecha_inicio =format(primerDiaMesAnterior, maskFecha)
        consolidado.fecha_fin =format(ultimoDiaMesAnterior, maskFecha)
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
    //Filtro tipos de reportes
    function filtarTiposSaldos(val, update) {
      if (val === '') {
        update(() => {
          tipos_saldos_consolidado.value = listadosAuxiliares.tipos_saldos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_saldos_consolidado.value = listadosAuxiliares.tipos_saldos.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    async function generar_reporte(
      valor: Consolidado,
      tipo: string
    ): Promise<void> {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename =
          'reporte_semanal_consolidado_del_' +
          valor.fecha_inicio +
          '_al_' +
          valor.fecha_fin
        switch (tipo) {
          case tipoReportes.EXCEL:
            const url_excel =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.consolidado_excel)
            imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
            break
          case tipoReportes.PDF:
            const url_pdf =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.consolidado_pdf)
            imprimirArchivo(url_pdf, 'POST', 'blob', 'pdf', filename, valor)
            break
          default:
            break
        }
      }
    }
    function mostrarEmpleados() {
      consolidado.empleado = null
    }
    async function recargarEmpleadosInactivos() {
      usuariosInactivos.value = (
        await new EmpleadoController().listar({
          campos: 'id,nombres,apellidos',
          estado: 0,
        })
      ).result
      listadosAuxiliares.usuariosInactivos = usuariosInactivos.value
      LocalStorage.set('usuariosInactivos', JSON.stringify(usuariosInactivos.value))
    }
    function optionsFechaInicio(date) {
      const fecha_actual = format(new Date(), maskFecha)
      return date <= fecha_actual
    }
    function optionsFechaFin(date) {
      const fecha_actual = format(new Date(), maskFecha)
      const fecha_inicio = format(
        consolidado.fecha_inicio !== null
          ? consolidado.fecha_inicio
          : new Date(),
          maskFecha
      )
      return date >= fecha_inicio && date <= fecha_actual
    }
    function limpiar() {
      is_all_empleados.value = 'false'
    }
    return {
      mixin,
      consolidado,
      disabled,
      accion,
      v$,
      maskFecha,
      usuarios,
      usuariosInactivos,
      tiposFondos,
      tiposFondoRotativoFechas,
      tipos_saldos_consolidado,
      tipo_saldo,
      is_all_empleados,
      is_inactivo,
      generar_reporte,
      filtrarUsuarios,
      filtrarUsuariosInactivos,
      filtrarTiposFondos,
      filtrarTiposFondoRotativoFechas,
      filtarTiposSaldos,
      mostrarEmpleados,
      watchEffect,
      optionsFechaInicio,
      optionsFechaFin,
      recargarEmpleadosInactivos,
      limpiar,
    }
  },
})
