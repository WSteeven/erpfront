// Dependencias
import { configuracionColumnasFormacionAcademicaReactive } from '../../solicitudPuestoTrabajo/domain/configuracionColumnasFormacionAcademicaReactive'
import { configuracionColumnasVacante } from '../domain/configuracionColumnasVacante'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { format } from '@formkit/tempo'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { acciones, accionesTabla, maskFecha, } from 'config/utils'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { AreaConocimientoController } from '../../areasConocimiento/infraestructure/AreaConocimientoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Vacante } from '../domain/Vacante'
import { VacanteController } from '../infraestructure/VacanteController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useSeleccionContratacionStore } from 'stores/recursosHumanos/seleccionContratacion/seleccionContratacion'
import { SolicitudPuestoEmpleoController } from '../../solicitudPuestoTrabajo/infraestructure/SolicitudPuestoEmpleoController'
import { aniosExperiencia, opcionesTablaVacantes, tabOptionsVacantes } from 'config/seleccionContratacionPersonal.utils'
import { TipoPuestoController } from '../../tiposPuestos/infraestructure/TipoPuestoController'
import { required, requiredIf } from 'shared/i18n-validators'
import { tipo_puesto } from 'config/recursosHumanos.utils'
import { ModalidadController } from '../../modalidades/infraestructure/ModalidadController'

export default defineComponent({
  name: 'VacantePage',
  components: { TabLayoutFilterTabs2, EssentialEditor, EssentialTable, GestorArchivos, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(Vacante, new VacanteController())
    const { entidad: vacante, accion, disabled, listadosAuxiliares, } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    /***************************************************************************
     * stores
    ****************************************************************************/
    // const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()
    const solicitudStore = useSeleccionContratacionStore()

    /***************************************************************************
     * variables
    ****************************************************************************/
    const anios_experiencia = ref(aniosExperiencia)
    const refArchivo = ref()
    const idPuestoEmpleo = ref()
    const tabActual = ref(opcionesTablaVacantes.publicadas)

    const { areasConocimiento, filtrarAreasConocimiento } = useFiltrosListadosSelects(listadosAuxiliares)

    const modalidades = ref([])
    const tiposPuestos = ref([])
    const autorizaciones = ref([])

    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    onGuardado((id: number) => {
      idPuestoEmpleo.value = id
      setTimeout(() => {
        subirArchivos()
      }, 1)
    })
    cargarVista(async () => {
      //Verificamos si llegó una solicitud de vacante
      if (solicitudStore.idSolicitudVacante > 0) {
        // consultar la solicitud para empaquetar
        await consultarSolicitudEmpleado()
        if (solicitudStore.solicitudPersonal) cargarDatosSolicitud()
      }

      await obtenerListados({
        tiposPuestos: {
          controller: new TipoPuestoController(),
          params: {
            campos: 'id,nombre',
          },
        },
        autorizaciones: {
          controller: new AutorizacionController(),
          params: {
            campos: 'id,nombre',
          },
        },
        areasConocimiento: new AreaConocimientoController(),
        modalidades: {
          controller: new ModalidadController(),
          params: { activo: 1 }
        }
      })
      areasConocimiento.value = listadosAuxiliares.areasConocimiento
      tiposPuestos.value = listadosAuxiliares.tiposPuestos
      autorizaciones.value = listadosAuxiliares.autorizaciones
      modalidades.value = listadosAuxiliares.modalidades

    })

    /*****************************************************************************************
     * REGLAS DE VALIDACION
    *****************************************************************************************/
    //Reglas de validacion
    const reglas = {
      nombre: { required },
      tipo_puesto: { required },
      imagen_referencia: { required },
      imagen_publicidad: { required },
      fecha_caducidad: { required },
      descripcion: { required },
      modalidad: { required },
      anios_experiencia: { required: requiredIf(() => vacante.requiere_experiencia) },
      areas_conocimiento: {
        required: requiredIf(() => vacante.tipo_puesto !== tipo_puesto.pasante),
      },
      formaciones_academicas: {
        required: requiredIf(() => vacante.requiere_formacion_academica),
      },
    }

    const v$ = useVuelidate(reglas, vacante)
    setValidador(v$.value)


    /****************************************************************************
     * FUNCIONES
     ****************************************************************************/
    async function filtrarVacantes(tab: string) {
      tabActual.value = tab
      switch (tab) {
        case opcionesTablaVacantes.inactivas:
          listar({ activo: 0 })

          break;
        case opcionesTablaVacantes.publicadas:
          listar({ activo: 1 })

          break;
        case opcionesTablaVacantes.vigentes:
          listar()

          break;
        case opcionesTablaVacantes.expiradas:
          listar()



      }
    }
    async function consultarSolicitudEmpleado() {
      try {
        cargando.activar()
        const response = await new SolicitudPuestoEmpleoController().consultar(solicitudStore.idSolicitudVacante)
        console.log(response)
        solicitudStore.solicitudPersonal.hydrate(response.result)
      } catch (error) {

      } finally {
        cargando.desactivar()
      }
    }

    function cargarDatosSolicitud() {
      // Cargar datos de solicitud
      vacante.solicitud = solicitudStore.solicitudPersonal.id
      vacante.anios_experiencia = solicitudStore.solicitudPersonal.anios_experiencia
      vacante.areas_conocimiento = solicitudStore.solicitudPersonal.areas_conocimiento
      vacante.descripcion = solicitudStore.solicitudPersonal.descripcion ?? ''
      vacante.requiere_formacion_academica = solicitudStore.solicitudPersonal.requiere_formacion_academica
      vacante.formaciones_academicas = solicitudStore.solicitudPersonal.formaciones_academicas
      vacante.nombre = solicitudStore.solicitudPersonal.nombre
      vacante.requiere_experiencia = solicitudStore.solicitudPersonal.requiere_experiencia
      vacante.tipo_puesto = solicitudStore.solicitudPersonal.tipo_puesto
      vacante.modalidad = solicitudStore.solicitudPersonal.modalidad
      vacante.disponibilidad_viajar = solicitudStore.solicitudPersonal.disponibilidad_viajar
      vacante.requiere_licencia = solicitudStore.solicitudPersonal.requiere_licencia
    }

    function btnEliminarConocimiento() {
      console.log('eliminar')
    }
    function btnEliminarFormacionAcademica() {
      console.log('eliminar')
    }
    function agregarConocimiento() {
      console.log('agregar')
    }
    function agregarFormacionAcademica() {
      console.log('agregar')
    }
    function optionsFechaCaducidad(date) {

      const fecha_actual = format(new Date(), 'YYYY/MM/DD')

      return (
        date >= fecha_actual
      )
    }

    function filtrarAniosExperiencia(val, update) {
      val = val.toUpperCase()
      update(() => {
        if (val == '') anios_experiencia.value = aniosExperiencia
        else {
          anios_experiencia.value = aniosExperiencia.filter(v => v.toUpperCase().indexOf(val) > -1)
        }
      })
    }

    function checkRequiereFormacionAcademica(val) {
      if (!val) vacante.formaciones_academicas = []
    }

    function checkRequiereExperiencia(val) {
      if (!val) vacante.anios_experiencia = null
    }


    /****************************************************************************
     * BOTONES DE TABLA
     ****************************************************************************/



    return {
      removeAccents,
      btnEliminarConocimiento,
      btnEliminarFormacionAcademica,
      agregarConocimiento,
      agregarFormacionAcademica,
      optionsFechaCaducidad,
      vacante,
      mixin,
      disabled,
      accion,
      v$,
      acciones,
      accionesTabla,
      configuracionColumnas: configuracionColumnasVacante,
      configuracionColumnasFormacionAcademicaReactive,
      refArchivo,
      maskFecha,
      tabActual,
      tabOptions: tabOptionsVacantes,
      tiposPuestos,
      autorizaciones,

      //listados
      areasConocimiento, filtrarAreasConocimiento,
      anios_experiencia,
      modalidades,

      //funciones
      filtrarVacantes,
      filtrarAniosExperiencia,
      checkRequiereFormacionAcademica,
      checkRequiereExperiencia,

      //botones de tabla

    }
  },
})
