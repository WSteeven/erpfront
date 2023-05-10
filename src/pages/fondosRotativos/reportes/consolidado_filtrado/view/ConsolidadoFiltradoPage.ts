import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { ConsolidadoFiltrado } from '../domain/ConsolidadoFiltrado'

import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'
import { ConsolidadoFiltradoController } from '../infrestructure/ConsolidadoFiltradoController'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { UsuarioAutorizadoresController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioAutorizadoresController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'

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
      ConsolidadoFiltrado,
      new ConsolidadoFiltradoController()
    )
    const {
      entidad: consolidadofiltrado,
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
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      proyecto: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      tarea: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      detalle: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      subdetalle: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      autorizador: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      tipo_saldo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      tipo_filtro: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      fecha_inicio: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      fecha_fin: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      ruc: {
        required: true,
        minLength: 13,
      },
    }
    const tipos_saldos = ref([
      { value: '1', label: 'Acreditacion' },
      { value: '2', label: 'Gasto' },
      { value: '3', label: 'Consolidado' },
    ])
    const tipos_filtros = ref([
      { value: '0', name: 'Todos' },
      { value: '1', name: 'Proyecto' },
      { value: '2', name: 'Tarea' },
      { value: '3', name: 'Detalle' },
      { value: '4', name: 'SubDetalle' },
      { value: '5', name: 'Autorizacion' },
      { value: '6', name: 'Empleado' },
      { value: '7', name: 'RUC' },
      { value: '8', name: 'SIN COMPROBANTE' },
    ])
    listadosAuxiliares.tipos_saldos = tipos_saldos
    listadosAuxiliares.tipos_filtro = tipos_filtros
    const v$ = useVuelidate(reglas, consolidadofiltrado)
    setValidador(v$.value)
    const usuarios = ref([])
    const tiposFondos = ref([])
    const tiposFondoRotativoFechas = ref([])
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizacionesEspeciales = ref([])
    const tareas = ref([])
    const filteredSubdetalles= []
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
        detalles: {
          controller: new DetalleFondoController(),
          params: { campos: 'id,descripcion' },
        },
        autorizacionesEspeciales: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        sub_detalles: {
          controller: new SubDetalleFondoController(),
          params: { campos: 'id,descripcion' },
        },
        proyectos: {
          controller: new ProyectoController(),
          params: { campos: 'id,nombre,codigo_proyecto' },
        },
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id' },
        },
      })

      usuarios.value = listadosAuxiliares.usuarios
      tiposFondos.value = listadosAuxiliares.tiposFondos
      tiposFondoRotativoFechas.value =
        listadosAuxiliares.tiposFondoRotativoFechas
      detalles.value = listadosAuxiliares.detalles
      autorizacionesEspeciales.value =
        listadosAuxiliares.autorizacionesEspeciales
      sub_detalles.value = listadosAuxiliares.sub_detalles
      proyectos.value = listadosAuxiliares.proyectos
      tareas.value = listadosAuxiliares.tareas
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

    // - Filtro AUTORIZACIONES ESPECIALES

    function filtrarAutorizacionesEspeciales(val, update) {
      if (val === '') {
        update(() => {
          autorizacionesEspeciales.value =
            listadosAuxiliares.autorizacionesEspeciales
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        autorizacionesEspeciales.value =
          listadosAuxiliares.autorizacionesEspeciales.filter(
            (v) => v.usuario.toLowerCase().indexOf(needle) > -1
          )
      })
    }
    // - Filtro Detalles

    function filtrarDetalles(val, update) {
      if (val === '') {
        update(() => {
          detalles.value = listadosAuxiliares.detalles
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        detalles.value = listadosAuxiliares.detalles.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }


    function filtrarProyectos(val, update) {
      if (val === '') {
        update(() => {
          proyectos.value = listadosAuxiliares.proyectos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        proyectos.value = listadosAuxiliares.proyectos.filter(
          (v) =>
            v.codigo_proyecto.toLowerCase().indexOf(needle) > -1 ||
            v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtrarTareas(val, update) {
      if (consolidadofiltrado.proyecto == 0) {
        update(() => {
          tareas.value = listadosAuxiliares.tareas.filter(
            (v) => v.proyecto_id == null
          )
        })
        return
      }
      if (val === '') {
        update(() => {
          tareas.value = listadosAuxiliares.tareas.filter(
            (v) => v.proyecto_id == consolidadofiltrado.proyecto
          )
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tareas.value = listadosAuxiliares.tareas.filter(
          (v) =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.detalle.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    // - Filtro tipos Filtro
    function filtrarTiposFiltro(val, update) {
      switch (consolidadofiltrado.tipo_saldo) {
        case '1':
          update(() => {
            tipos_filtros.value = listadosAuxiliares.tipos_filtro.filter(
              (v) => v.value == 6
            )
          })
          break

        default:
          update(() => {
            tipos_filtros.value = [
              { value: '0', name: 'Todos' },
              { value: '1', name: 'Proyecto' },
              { value: '2', name: 'Tarea' },
              { value: '3', name: 'Detalle' },
              { value: '4', name: 'SubDetalle' },
              { value: '5', name: 'Autorizacion' },
              { value: '6', name: 'Empleado' },
              { value: '7', name: 'RUC' },
              { value: '8', name: 'SIN COMPROBANTE' },
            ]
          })
          break
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_filtros.value = listadosAuxiliares.tipos_filtro.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    //Filtro tipos de reportes
    function filtarTiposSaldos(val, update) {
      if (val === '') {
        update(() => {
          tipos_saldos.value = listadosAuxiliares.tipos_saldos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_saldos.value = listadosAuxiliares.tipos_saldos.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const opcionesSubdetalles = computed(() => {
      if (consolidadofiltrado.detalle == null || consolidadofiltrado.detalle == 0) {
        return listadosAuxiliares.sub_detalles
      }
      return listadosAuxiliares.sub_detalles.filter(
        (subdetalle) => subdetalle.id_detalle_viatico === consolidadofiltrado.detalle
      )
    })

    function filtroSubdetalles(val, update) {
      if (val === ' ') {
        update(() => {
          opcionesSubdetalles.value
        })
        return
      }
      const needle = val.toLowerCase()
      update(() => {
        return opcionesSubdetalles.value.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function generar_reporte(
      valor: ConsolidadoFiltrado,
      tipo: string
    ): Promise<void> {
      const axios = AxiosHttpRepository.getInstance()
      const filename =
        'reporte_gastos_del_' + valor.fecha_inicio + '_al_' + valor.fecha_fin
      switch (tipo) {
        case 'excel':
          const url_excel =
            apiConfig.URL_BASE +
            '/' +
            axios.getEndpoint(endpoints.consolidado_filtrado_excel)
          imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
          break
        case 'pdf':
          const url_pdf =
            apiConfig.URL_BASE +
            '/' +
            axios.getEndpoint(endpoints.consolidado_filtrado_pdf)
          imprimirArchivo(url_pdf, 'POST', 'blob', 'pdf', filename, valor)
          break
        default:
          break
      }
    }
    return {
      mixin,
      consolidadofiltrado,
      disabled,
      accion,
      v$,
      usuarios,
      tiposFondos,
      tiposFondoRotativoFechas,
      tipos_saldos,
      tipos_filtros,
      autorizacionesEspeciales,
      detalles,
      sub_detalles,
      proyectos,
      tareas,
      generar_reporte,
      filtrarUsuarios,
      filtarTiposSaldos,
      filtrarTiposFiltro,
      filtroSubdetalles,
      filtrarAutorizacionesEspeciales,
      opcionesSubdetalles,
      filtrarDetalles,
      filtrarProyectos,
      filtrarTareas,
      watchEffect,
      listadosAuxiliares,
    }
  },
})
