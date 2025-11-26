import { defineComponent, ref } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo, ordenarLista } from 'shared/utils'
import { Consolidado } from '../domain/Consolidado'
import { ConsolidadoController } from '../infrestructure/ConsolidadoController'
import { maskFecha, tipo_saldo, tipoReportes, tipos_saldos } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useCargandoStore } from 'stores/cargando'
import { required } from 'shared/i18n-validators'
import { addDay, format, monthStart } from '@formkit/tempo'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { SelectOption } from 'components/tables/domain/SelectOption'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'

export default defineComponent({
  components: { NoOptionComponent, ErrorComponent, TabLayout },
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
      Consolidado,
      new ConsolidadoController()
    )
    const {
      entidad: consolidado,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      tipo_saldo: {
        required
      },
      fecha_inicio: {
        required
      },
      fecha_fin: {
        required
      }
    }

    const is_all_empleados = ref(false)
    const is_inactivo = ref(false)
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
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        tiposFondos: {
          controller: new TipoFondoController(),
          params: { campos: 'id,descripcion' }
        }
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

      consolidado.fecha_inicio = format(primerDiaMesAnterior, maskFecha)
      consolidado.fecha_fin = format(ultimoDiaMesAnterior, maskFecha)
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
          v =>
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
          v =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    // - Filtro TIPOS FONDOS
    // - Filtro TIPOS FONDOS
    //Filtro tipos de reportes
    function filtarTiposSaldos(val, update) {
      if (val === '') {
        update(() => {
          listadosAuxiliares.tipos_saldos = tipos_saldos
          tipos_saldos_consolidado.value = listadosAuxiliares.tipos_saldos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_saldos_consolidado.value = listadosAuxiliares.tipos_saldos.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function obtenerTipoReporte() {
      const opReporte = tipos_saldos.filter(
        (v: SelectOption) => v.value === consolidado.tipo_saldo
      )[0]
      return opReporte.label
    }
    function obtenerNombresEmpleadoSeleccionado() {
      const empleadoEncontrado: Empleado = usuarios.value.filter(
        (v: Empleado) => v.id === consolidado.empleado
      )[0]
      return empleadoEncontrado?.nombres + ' ' + empleadoEncontrado?.apellidos
    }
    async function generar_reporte(
      valor: Consolidado,
      tipo: string
    ): Promise<void> {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename =
          'Reporte ' +
          obtenerTipoReporte() +
          ' de ' +
          obtenerNombresEmpleadoSeleccionado() +
          ' del ' +
          valor.fecha_inicio +
          ' al ' +
          valor.fecha_fin
        switch (tipo) {
          case tipoReportes.EXCEL:
            const url_excel =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.consolidado_excel)
            await imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
            break
          case tipoReportes.PDF:
            const url_pdf =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.consolidado_pdf)
            await imprimirArchivo(url_pdf, 'POST', 'blob', 'pdf', filename, valor)
            break
          default:
            break
        }
      }
    }
    function mostrarEmpleados() {
      consolidado.empleado = null
      console.log(is_all_empleados.value)
    }
    async function recargarEmpleadosInactivos() {
      usuariosInactivos.value = (
        await new EmpleadoController().listar({
          campos: 'id,nombres,apellidos',
          estado: 0
        })
      ).result
      listadosAuxiliares.usuariosInactivos = usuariosInactivos.value
      LocalStorage.set(
        'usuariosInactivos',
        JSON.stringify(usuariosInactivos.value)
      )
    }
    function limpiar() {
      is_all_empleados.value = false
    }
    return {
      consolidado,
      disabled,
      v$,
      maskFecha,
      usuarios,
      usuariosInactivos,
      tipos_saldos_consolidado,
      tipo_saldo,
      is_all_empleados,
      is_inactivo,

      //funciones
      ordenarLista,
      generar_reporte,
      filtrarUsuarios,
      filtrarUsuariosInactivos,
      filtarTiposSaldos,
      mostrarEmpleados,
      recargarEmpleadosInactivos,
      limpiar
    }
  }
})
