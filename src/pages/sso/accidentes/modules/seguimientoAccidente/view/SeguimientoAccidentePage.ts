// Dependencias
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { acciones, accionesTabla } from 'config/utils'
import { tiposCitaMedica } from 'config/utils/medico'
import { defineComponent, ref, nextTick } from 'vue'

// Componentes
import { configuracionColumnasSeguimientoAccidenteConsultaMedica } from '../domain/configuracionColumnasSeguimientoAccidenteConsultaMedica'
import MultiplePageLayout from 'shared/contenedor/modules/simple/view/MultiplePageLayout.vue'
import DiagnosticoRecetaPage from 'medico/diagnosticoReceta/view/DiagnosticoRecetaPage.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import CitaMedicaPage from 'medico/citaMedica/view/CitaMedicaPage.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SeguimientoAccidenteController } from '../infraestructure/SeguimientoAccidenteController'
import { SeguimientoAccidenteConsultaMedica } from '../domain/SeguimientoAccidenteConsultaMedica'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { CitaMedica } from 'pages/medico/citaMedica/domain/CitaMedica'
import { SeguimientoAccidente } from '../domain/SeguimientoAccidente'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  components: { MultiplePageLayout, SimpleLayout, SelectorImagen, EssentialEditor, GestorArchivos, EssentialTable, CitaMedicaPage, DiagnosticoRecetaPage },
  setup() {
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(SeguimientoAccidente, new SeguimientoAccidenteController())

    const { entidad: seguimiento, disabled, accion, tabsPage, listadosAuxiliares } = mixin.useReferencias()
    const { consultar, listar, cargarVista, obtenerListados, editarParcial } = mixin.useComportamiento()
    const { onReestablecer, onConsultado, onModificado } = mixin.useHooks()

    cargarVista(() =>
      obtenerListados({
        tareas: {
          controller: new TareaController(),
          params: {
            campos: 'id,codigo_tarea,titulo,cliente_id',
            'f_params[orderBy][field]': 'id',
            'f_params[orderBy][type]': 'DESC',
            'f_params[limit]': 50
          }
        },
      })
    )

    /*************
     * Variables
     *************/
    const idEntidad = ref()
    const refArchivo = ref()
    const refCitaMedica = ref()
    const refDiagnosticoReceta = ref()
    const puedeGestionarSso = authenticationStore.esSso || authenticationStore.esAdministrador

    /*************
     * Funciones
     *************/
    const { tareas, filtrarTareas } = useFiltrosListadosSelects(listadosAuxiliares)

    const consultarSubtareas = (idTarea: number | null) => {
      cargarVista(() =>
        obtenerListados({
          subtareas: {
            controller: new SubtareaController(),
            params: {
              campos: 'id,codigo_subtarea,titulo',
              'f_params[orderBy][field]': 'id',
              'f_params[orderBy][type]': 'DESC',
              tarea_id: idTarea,
            }
          },
        })
      )
    }

    const subirArchivos = async () => await refArchivo.value.subir()

    const guardadoCitaMedica = (citaMedica: CitaMedica) => {
      tabsPage.value = '1'
      const index = seguimiento.consultas_medicas.findIndex((s: SeguimientoAccidenteConsultaMedica) => s.empleado_id === citaMedica.paciente_id)
      seguimiento.consultas_medicas[index].cita_medica = citaMedica.id
    }

    const descargarInformePdf = () => {
      listar({ export: 'pdf', seguimiento_accidente_id: seguimiento.id, titulo: `Informe de seguimiento de accidente ${seguimiento.id}` })
    }

    const editarSeguimientoParcial = (campo: keyof SeguimientoAccidente, valor) => {
      editarParcial(seguimiento.id!, { [campo]: valor })
    }

    /*****************
     * Botones tabla
     *****************/
    const btnSolicitarCitaMedica: CustomActionTable<SeguimientoAccidenteConsultaMedica> = {
      titulo: ({ entidad }) => `${entidad.cita_medica ? 'Consultar' : 'Solicitar'} cita médica`,
      icono: ({ entidad }) => `${entidad.cita_medica ? 'bi-eye' : 'bi-calendar-check-fill'} cita médica`,
      color: ({ entidad }) => `${entidad.cita_medica ? 'positive' : 'primary'}`,
      accion: async ({ entidad }) => {
        tabsPage.value = '2'
        nextTick(() => {
          refCitaMedica.value.reestablecer()
          refCitaMedica.value.citaMedica.paciente = entidad.empleado_id
          refCitaMedica.value.citaMedica.tipo_cita_medica = tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value
          refCitaMedica.value.citaMedica.accidente = seguimiento.accidente
          refCitaMedica.value.citaMedica.fecha_accidente = seguimiento.fecha_hora_accidente?.split(' ')[0]
          refCitaMedica.value.citaMedica.hora_accidente = seguimiento.fecha_hora_accidente?.split(' ')[1]
          if (entidad.cita_medica) {
            refCitaMedica.value.consultar({ id: entidad.cita_medica })
            refCitaMedica.value.accion = acciones.consultar
          }
          refCitaMedica.value.empleado.hydrate(new Empleado())
          refCitaMedica.value.consultarEmpleado(entidad.empleado_id)
        })
      }
    }

    const btnConsultarDiagnosticoRecomendaciones: CustomActionTable<SeguimientoAccidenteConsultaMedica> = {
      titulo: 'Consultar diagnóstico y recomendaciones',
      icono: 'bi-capsule-pill',
      color: 'blue-grey',
      visible: ({ entidad }) => entidad.cita_medica_atendida,
      accion: async ({ entidad }) => {
        tabsPage.value = '3'
        nextTick(() => {
          refDiagnosticoReceta.value.reestablecer()
          refDiagnosticoReceta.value.empleado.hydrate(new Empleado())
          refDiagnosticoReceta.value.consulta.cita_medica = entidad.cita_medica
          refDiagnosticoReceta.value.consultarEmpleado(entidad.empleado_id)
          refDiagnosticoReceta.value.consultarConsulta({ cita_medica_id: entidad.cita_medica })
          refDiagnosticoReceta.value.accion = acciones.consultar
          // refDiagnosticoReceta.value.listar({ empleado_id: entidad.empleado_id })
        })
      }
    }

    /********
     * Hooks
     ********/
    onConsultado(() => {
      setTimeout(() => refArchivo.value.listarArchivosAlmacenados(seguimiento.id), 1)
    })

    /* onGuardado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
    }) */

    onModificado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
    })

    onReestablecer(async () => {
      await refArchivo.value.limpiarListado()
      accion.value = acciones.editar
      await consultar({ id: idEntidad.value })
    })

    /********
     * Init
     ********/
    accion.value = acciones.editar

    return {
      mixin,
      disabled,
      seguimiento,
      accion,
      acciones,
      idEntidad,
      refArchivo,
      refCitaMedica,
      refDiagnosticoReceta,
      consultar,
      tabsPage,
      columnas: [...configuracionColumnasSeguimientoAccidenteConsultaMedica, accionesTabla],
      btnSolicitarCitaMedica,
      btnConsultarDiagnosticoRecomendaciones,
      guardadoCitaMedica,
      descargarInformePdf,
      consultarSubtareas,
      listadosAuxiliares,
      tareas,
      filtrarTareas,
      puedeGestionarSso,
      editarSeguimientoParcial,
    }
  }
})