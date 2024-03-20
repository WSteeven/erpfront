import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { ConsolidadoFiltrado } from '../domain/ConsolidadoFiltrado'

import { ConsolidadoFiltradoController } from '../infrestructure/ConsolidadoFiltradoController'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useCargandoStore } from 'stores/cargando'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { useNotificaciones } from 'shared/notificaciones'
import { maskFecha, tipoReportes, tipos_saldos } from 'config/utils'
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
    const fondosStore = useFondoRotativoStore()
    const {notificarError} = useNotificaciones()

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
      tipo_saldo: {
        required
      },
      tipo_filtro: {
        required
      },
      fecha_inicio: {
        required
      },
      fecha_fin: {
        required
      },
      ruc: {
        minLength: 13,
      },
    }
    const tipos_saldos_consolidado_filtro = ref()
    const tipos_filtros = ref([
      { value: '0', name: 'Todos' },
      { value: '1', name: 'Proyecto' },
      { value: '2', name: 'Tarea' },
      { value: '3', name: 'Detalle' },
      { value: '4', name: 'SubDetalle' },
      { value: '5', name: 'Autorizacion' },
      { value: '6', name: 'Empleado' },
      { value: '7', name: 'RUC' },
      { value: '8', name: 'SIN FACTURA' },
      { value: '9', name: 'CIUDAD' },
    ])
    tipos_saldos_consolidado_filtro.value = tipos_saldos
    listadosAuxiliares.tipos_saldos = tipos_saldos
    listadosAuxiliares.tipos_filtro = tipos_filtros
    const v$ = useVuelidate(reglas, consolidadofiltrado)
    const usuarios = ref([])
    const usuariosInactivos = ref()
    const tiposFondos = ref([])
    const tiposFondoRotativoFechas = ref([])
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizacionesEspeciales = ref([])
    const tareas = ref([])
    const cantones = ref([])
    const is_inactivo = ref('false')
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
        cantones: {
          controller: new CantonController(),
          params: { campos: 'id,canton' },
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
      cantones.value = listadosAuxiliares.cantones

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
    //Filtro de Cantones
    function filtrarCiudades(val, update) {
      if (val === '') {
        update(() => {
          cantones.value = listadosAuxiliares.cantones
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        cantones.value = listadosAuxiliares.cantones.filter(
          (v) => v.canton.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    //Filtro de Protyectos
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
    /**Filtro de Tareas */
    function filtrarTareas(val, update) {
      if (val === '') {
        update(() => {
          tareas.value = listadoTareas.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tareas.value = listadoTareas.value.filter(
          (v) =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.titulo.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    const listadoTareas = computed(() => {
      if (consolidadofiltrado.proyecto == 0) {
        return listadosAuxiliares.tareas.filter(
          (tarea: Tarea) => tarea.proyecto_id === null || tarea.id == 0
        )
      }
      return listadosAuxiliares.tareas.filter(
        (tarea: Tarea) =>
          tarea.proyecto_id === consolidadofiltrado.proyecto || tarea.id == 0
      )
    })
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
              { value: '8', name: 'SIN FACTURA' },
              { value: '9', name: 'CIUDAD' },

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
          tipos_saldos_consolidado_filtro.value = listadosAuxiliares.tipos_saldos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_saldos_consolidado_filtro.value = listadosAuxiliares.tipos_saldos.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const opcionesSubdetalles = computed(() => {
      if (
        consolidadofiltrado.detalle == null ||
        consolidadofiltrado.detalle == 0
      ) {
        return listadosAuxiliares.sub_detalles
      }
      return listadosAuxiliares.sub_detalles.filter(
        (subdetalle) =>
          subdetalle.id_detalle_viatico === consolidadofiltrado.detalle
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
        sub_detalles.value = opcionesSubdetalles.value.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function generar_reporte(
      valor: ConsolidadoFiltrado,
      tipo: string
    ): Promise<void> {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename =
          'reporte_gastos_del_' + valor.fecha_inicio + '_al_' + valor.fecha_fin
        switch (tipo) {
          case tipoReportes.EXCEL:
            const url_excel =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.consolidado_filtrado_excel)
            imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
            break
          case tipoReportes.PDF:
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
    function optionsFechaFin(date) {
      const fechaActual = format(
        consolidadofiltrado.fecha_inicio !== null
          ? consolidadofiltrado.fecha_inicio
          : new Date(),
        'YYYY/MM/DD'
      )
      return date >= fechaActual
    }
    return {
      mixin,
      consolidadofiltrado,
      disabled,
      accion,
      v$,
      usuarios,
      usuariosInactivos,
      tiposFondos,
      tiposFondoRotativoFechas,
      tipos_saldos_consolidado_filtro,
      tipos_filtros,
      cantones,
      autorizacionesEspeciales,
      detalles,
      sub_detalles,
      proyectos,
      tareas,
      generar_reporte,
      is_inactivo,
      filtrarUsuarios,
      filtrarUsuariosInactivos,
      filtarTiposSaldos,
      filtrarTiposFiltro,
      filtroSubdetalles,
      filtrarAutorizacionesEspeciales,
      opcionesSubdetalles,
      filtrarDetalles,
      filtrarProyectos,
      filtrarTareas,
      filtrarCiudades,
      watchEffect,
      listadosAuxiliares,
      maskFecha,
      optionsFechaFin
    }
  },
})
