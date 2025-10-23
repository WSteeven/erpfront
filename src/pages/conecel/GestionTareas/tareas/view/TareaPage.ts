import { defineComponent, reactive, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Tarea } from 'pages/conecel/GestionTareas/tareas/domain/Tarea'
import { TareaController } from 'pages/conecel/GestionTareas/tareas/infraestructure/TareaController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import useVuelidate from '@vuelidate/core'
import { configuracionColumnasTarea } from 'pages/conecel/GestionTareas/tareas/domain/configuracionColumnasTareas'
import { TipoActividadController } from 'pages/conecel/GestionTareas/tiposActividades/infraestructure/TipoActividadController'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import {
  estadosTareasConecel,
  tabOptionsTareasConecel
} from 'pages/conecel/conecel.utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import {
  btnEliminarDefault,
  encontrarUltimoIdListado,
  obtenerFechaActual,
  obtenerUbicacion,
  ordenarLista
} from 'shared/utils'
import MapaComponent from 'components/mapas/MapaComponent.vue'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Hijo } from 'trabajoSocial/fichaSocioeconomica/domain/Hijo'

export default defineComponent({
  components: {
    EssentialTable,
    GestorArchivos,
    MapaComponent,
    NoOptionComponent,
    ErrorComponent,
    TabLayoutFilterTabs2
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())
    const {
      entidad: tarea,
      listadosAuxiliares,
      accion,
      disabled,
      filtros,
      pagination,
      metaPagination
    } = mixin.useReferencias()
    const {
      guardar,
      editar,
      eliminar,
      reestablecer,
      setValidador,
      obtenerListados,
      cargarVista,
      listar
    } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado } = mixin.useHooks()
    const refArchivo = ref()
    const idTarea = ref()
    const currentTab = ref('TODOS')
    const tipos_actividades = ref([])
    const { grupos, filtrarGrupos } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        tipos_actividades: {
          controller: new TipoActividadController(),
          params: { activo: 1 }
        },
        grupos: {
          controller: new GrupoController(),
          params: { 'nombre[like]': '%INST%', activo: 1 }
        }
      })

      tipos_actividades.value = listadosAuxiliares.tipos_actividades

      // Datos por defecto
      cargarDatosDefecto()
    })

    const reglas = {
      direccion: { required },
      estado_tarea: { required },
      grupo: { required: requiredIf(() => tarea.asignada) },
      nombre_cliente: { required },
      orden_trabajo: { required },
      tipo_actividad: { required }
    }
    const v$ = useVuelidate(reglas, tarea)
    setValidador(v$.value)

    /*********
     * HOOKS
     **********/
    onReestablecer(() => {
      cargarDatosDefecto()
    })

    /*********
     * Funciones
     **********/
    function cargarDatosDefecto() {
      if (tipos_actividades.value.length == 1) {
        tarea.tipo_actividad = tipos_actividades.value[0].id
        tarea.estado_tarea = estadosTareasConecel[0].value
      }
      tarea.fecha = obtenerFechaActual(maskFecha)
      obtenerCoordenadas()
      tarea.coordenadas = {
        lat: tarea.latitud,
        lng: tarea.longitud,
        titulo: tarea.orden_trabajo ?? 'Mi Ubicación',
        descripcion: tarea.nombre_cliente ?? 'Mi posición actual'
      }
    }

    function obtenerCoordenadas() {
      obtenerUbicacion(location => {
        tarea.latitud = location.coords.latitude
        tarea.longitud = location.coords.longitude
      })
    }

    async function filtrarListadoTareas(tab: string) {
      currentTab.value = tab
      await listar({ estado_tarea: tab })
    }

    /********************************
     * BOTONES DE TABLA
     *******************************/
    const btnAgregarFilaTelefono: CustomActionTable = {
      titulo: 'Agregar Teléfono',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar teléfono',
      accion: () => {
        const telefono = reactive({
          id: '',
          telefono: ''
        })
        telefono.id = tarea.telefonos.length
          ? encontrarUltimoIdListado(tarea.telefonos) + 1
          : 1

        tarea.telefonos.push(telefono)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }

    return {
      mixin,
      tarea,
      v$,
      accion,
      disabled,
      refArchivo,
      currentTab,
      acciones,
      configuracionColumnas: configuracionColumnasTarea,
      estados_tareas: estadosTareasConecel,
      tipos_actividades,
      grupos,
      filtrarGrupos,
      ordenarLista,
      accionesTabla,
      maskFecha,
      tabOptions: tabOptionsTareasConecel,
      idTarea,
      btnAgregarFilaTelefono,
      btnEliminarDefault,
      filtrarListadoTareas
    }
  }
})
