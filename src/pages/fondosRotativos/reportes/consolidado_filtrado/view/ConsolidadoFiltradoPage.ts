import { computed, defineComponent, ref } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo, ordenarLista } from 'shared/utils'
import { ConsolidadoFiltrado } from '../domain/ConsolidadoFiltrado'

import { ConsolidadoFiltradoController } from '../infrestructure/ConsolidadoFiltradoController'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useCargandoStore } from 'stores/cargando'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import {
  maskFecha,
  rolesSistema,
  tipo_filtro,
  tipo_saldo,
  tipoReportes,
  tipos_filtros,
  tipos_saldos
} from 'config/utils'
import { addDay, format, monthStart } from '@formkit/tempo'
import { required, requiredIf } from 'shared/i18n-validators'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { NodoController } from 'gestionTrabajos/nodos/infraestructure/NodoController'
import ErrorComponent from 'components/ErrorComponent.vue'
import { EmpleadoRoleController } from 'recursosHumanos/empleados/infraestructure/EmpleadoRolesController'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'

export default defineComponent({
  components: { ErrorComponent, NoOptionComponent, TabLayout },
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
      ConsolidadoFiltrado,
      new ConsolidadoFiltradoController()
    )
    const {
      entidad: consolidadofiltrado,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { obtenerListados, cargarVista } = mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      tipo_saldo: {
        required
      },
      tipo_filtro: {
        requiredIfTipoFiltro: requiredIf(function () {
          return consolidadofiltrado.tipo_saldo != null
            ? consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
                consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA
            : false
        })
      },
      fecha_inicio: {
        required
      },
      fecha_fin: {
        required
      },
      empleado: {
        requiredIfEmpleado: requiredIf(function () {
          return consolidadofiltrado.tipo_saldo != null
            ? consolidadofiltrado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
                consolidadofiltrado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
                consolidadofiltrado.tipo_saldo ==
                  tipo_saldo.TRANSFERENCIA_SALDOS
            : false
        })
      },
      detalle: {
        requiredIfDetalle: requiredIf(function () {
          return consolidadofiltrado.tipo_filtro != null
            ? consolidadofiltrado.tipo_filtro == tipo_filtro.DETALLE
            : false
        })
      },
      subdetalle: {
        requiredIfSubdetalle: requiredIf(function () {
          return consolidadofiltrado.tipo_filtro != null
            ? consolidadofiltrado.tipo_filtro == tipo_filtro.SUBDETALLE
            : false
        })
      },
      id_proyecto: {
        requiredIfProyecto: requiredIf(function () {
          return consolidadofiltrado.tipo_filtro != null
            ? consolidadofiltrado.tipo_filtro == tipo_filtro.PROYECTO
            : false
        })
      },
      id_tarea: {
        requiredIfTarea: requiredIf(function () {
          return consolidadofiltrado.tipo_filtro != null
            ? consolidadofiltrado.tipo_filtro == tipo_filtro.TAREA
            : false
        })
      },
      aut_especial: {
        requiredIfAutorizador: requiredIf(function () {
          return consolidadofiltrado.tipo_filtro != null
            ? consolidadofiltrado.tipo_filtro == tipo_filtro.AUTORIZACIONES
            : false
        })
      },
      ruc: {
        minLength: 13
      },
      id_lugar: {
        requiredIfCiudad: requiredIf(function () {
          return consolidadofiltrado.tipo_filtro != null
            ? consolidadofiltrado.tipo_filtro == tipo_filtro.CIUDAD
            : false
        })
      },
      grupo: {
        required: requiredIf(
          () => consolidadofiltrado.tipo_filtro === tipo_filtro.GRUPO
        )
      }
    }
    const tipos_saldos_consolidado_filtro = ref()
    const tipos_filtros_consolidado_filtro = ref()

    tipos_saldos_consolidado_filtro.value = tipos_saldos
    tipos_filtros_consolidado_filtro.value = tipos_filtros
    listadosAuxiliares.tipos_saldos = tipos_saldos
    listadosAuxiliares.tipos_filtro = tipos_filtros
    const v$ = useVuelidate(reglas, consolidadofiltrado)
    const usuarios = ref([])
    const usuariosInactivos = ref()
    const tiposFondoRotativoFechas = ref([])
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizacionesEspeciales = ref([])
    const tareas = ref([])
    const cantones = ref([])
    const is_inactivo = ref(false)
    usuarios.value = listadosAuxiliares.usuarios
    const { nodos, filtrarNodos, grupos, filtrarGrupos } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        detalles: {
          controller: new DetalleFondoController(),
          params: { campos: 'id,descripcion' }
        },
        autorizacionesEspeciales: {
          controller: new EmpleadoRoleController(),
          params: { roles: [rolesSistema.autorizador] }
        },
        sub_detalles: {
          controller: new SubDetalleFondoController(),
          params: { campos: 'id,descripcion' }
        },
        proyectos: {
          controller: new ProyectoController(),
          params: { campos: 'id,nombre,codigo_proyecto' }
        },
        nodos: { controller: new NodoController(), params: { activo: 1 } },
        tareas: [] /*{
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id' },
        },*/,
        cantones: {
          controller: new CantonController(),
          params: { campos: 'id,canton' }
        }
      })

      usuarios.value = listadosAuxiliares.usuarios
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

      const primerDiaMes = monthStart(new Date())
      const ultimoDiaMesAnterior = addDay(primerDiaMes, -1)
      const primerDiaMesAnterior = monthStart(ultimoDiaMesAnterior)

      consolidadofiltrado.fecha_inicio = format(primerDiaMesAnterior, maskFecha)
      consolidadofiltrado.fecha_fin = format(ultimoDiaMesAnterior, maskFecha)
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
            v =>
              v.nombres.toLowerCase().indexOf(needle) > -1 ||
              v.apellidos.toLowerCase().indexOf(needle) > -1
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
          v => v.descripcion.toLowerCase().indexOf(needle) > -1
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
          v => v.canton.toLowerCase().indexOf(needle) > -1
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
          v =>
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
          v =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.titulo.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const listadoTareas = computed(() => {
      if (consolidadofiltrado.proyecto) {
        return listadosAuxiliares.tareas.filter(
          (tarea: Tarea) => tarea.proyecto_id === consolidadofiltrado.proyecto // || tarea.id == 0
        )
      } else return listadosAuxiliares.tareas
    })

    /* const listadoTareas = computed(() => {
      if (consolidadofiltrado.proyecto == 0) {
        return listadosAuxiliares.tareas.filter(
          (tarea: Tarea) => tarea.proyecto_id === null || tarea.id == 0
        )
      }
      return listadosAuxiliares.tareas.filter(
        (tarea: Tarea) =>
          tarea.proyecto_id === consolidadofiltrado.proyecto || tarea.id == 0
      )
    }) */

    // - Filtro tipos Filtro
    function filtrarTiposFiltro(val, update) {
      switch (consolidadofiltrado.tipo_saldo) {
        case '1':
          update(() => {
            tipos_filtros_consolidado_filtro.value =
              listadosAuxiliares.tipos_filtro.filter(v => v.value == 6)
          })
          break

        default:
          update(() => {
            tipos_filtros_consolidado_filtro.value = tipos_filtros
          })
          break
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_filtros_consolidado_filtro.value =
          listadosAuxiliares.tipos_filtro.filter(
            v => v.name.toLowerCase().indexOf(needle) > -1
          )
      })
    }

    //Filtro tipos de reportes
    function filtarTiposSaldos(val, update) {
      if (val === '') {
        update(() => {
          tipos_saldos_consolidado_filtro.value =
            listadosAuxiliares.tipos_saldos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_saldos_consolidado_filtro.value =
          listadosAuxiliares.tipos_saldos.filter(
            v => v.label.toLowerCase().indexOf(needle) > -1
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
        subdetalle =>
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
          v => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function generar_reporte(
      valor: ConsolidadoFiltrado,
      tipo: string
    ): Promise<void> {
      valor.isComponentFilesModified = null
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename =
          'reporte_gastos_del_' + valor.fecha_inicio + '_al_' + valor.fecha_fin
        switch (tipo) {
          case tipoReportes.EXCEL:
            const url_excel =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.consolidado_filtrado) +
              'excel'
            await imprimirArchivo(
              url_excel,
              'POST',
              'blob',
              'xlsx',
              filename,
              valor
            )
            break
          case tipoReportes.PDF:
            const url_pdf =
              apiConfig.URL_BASE +
              '/' +
              axios.getEndpoint(endpoints.consolidado_filtrado) +
              'pdf'
            await imprimirArchivo(
              url_pdf,
              'POST',
              'blob',
              'pdf',
              filename,
              valor
            )
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
          v =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    function limpiar() {
      consolidadofiltrado.empleado = null
      consolidadofiltrado.proyecto = null
      consolidadofiltrado.tarea = null
      consolidadofiltrado.detalle = null
      consolidadofiltrado.id_lugar = null
      consolidadofiltrado.subdetalle = null
      consolidadofiltrado.aut_especial = null
      consolidadofiltrado.ruc = null
      consolidadofiltrado.grupo = null

      switch (consolidadofiltrado.tipo_filtro) {
        case '0':
        case '2':
          // Todos o Tarea
          cargarVista(async () => {
            await obtenerListados({
              tareas: {
                controller: new TareaController(),
                params: {
                  todas:1,
                  campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id',
                  'f_params[orderBy][field]': 'id',
                  'f_params[orderBy][type]': 'DESC',
                  'f_params[limit]': 300
                }
              }
            })
            tareas.value = listadosAuxiliares.tareas
          })
          break
        case '10':
          cargarVista(async () => {
            await obtenerListados({
              grupos: {
                controller: new GrupoController(),
                params: { activo: 1 }
              }
            })
            listadosAuxiliares.grupos.unshift({ id: 0, nombre: ' SIN GRUPO' })
            grupos.value = listadosAuxiliares.grupos
          })
      }
    }

    // watch(grupos, ()=>{
    //   if(grupos.value.length === listadosAuxiliares.grupos.length)
    //     grupos.value.unshift({ id: 0, nombre: '_SIN GRUPO'})
    // })

    function limpiarTipoSaldo() {
      consolidadofiltrado.tipo_filtro = null
      limpiar()

      switch (consolidadofiltrado.tipo_saldo){
        case tipo_saldo.ACREDITACIONES:
          cargarVista(async () => {
            await obtenerListados({
              grupos: {
                controller: new GrupoController(),
                params: { activo: 1 }
              }
            })
            listadosAuxiliares.grupos.unshift({ id: 0, nombre: ' SIN GRUPO' })
            listadosAuxiliares.usuarios.unshift({ id: 0, nombres: ' TODOS', apellidos: ' ' })
            grupos.value = listadosAuxiliares.grupos
            consolidadofiltrado.empleado = 0
          })
          break
        default:

      }

    }

    function optionsFechaInicio(date) {
      const fecha_actual = format(new Date(), 'YYYY/MM/DD')
      return date <= fecha_actual
    }

    function optionsFechaFin(date) {
      const fecha_actual = format(new Date(), 'YYYY/MM/DD')
      const fecha_inicio = format(
        consolidadofiltrado.fecha_inicio !== null
          ? consolidadofiltrado.fecha_inicio
          : new Date(),
        'YYYY/MM/DD'
      )
      return date >= fecha_inicio && date <= fecha_actual
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

    return {
      consolidadofiltrado,
      disabled,
      v$,
      usuarios,
      usuariosInactivos,
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
      filtrarDetalles,
      filtrarProyectos,
      filtrarTareas,
      filtrarCiudades,
      grupos,
      filtrarGrupos,
      limpiarTipoSaldo,
      limpiar,
      maskFecha,
      optionsFechaInicio,
      optionsFechaFin,
      recargarEmpleadosInactivos,
      tipo_saldo,
      tipo_filtro,
      ordenarLista,

      // listados
      nodos,
      filtrarNodos
    }
  }
})
