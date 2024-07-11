// Dependencias
import { required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { encontrarUltimoIdListado, filtrarLista, removeAccents } from 'shared/utils'
import { acciones, accionesTabla } from 'config/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { tipo_puesto } from 'config/recursosHumanos.utils'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { SolicitudPuestoEmpleo } from '../domain/SolicitudPuestoEmpleo'
import { SolicitudPuestoEmpleoController } from '../infraestructure/SolicitudPuestoEmpleoController'
import { TipoPuestoTrabajoController } from 'pages/recursosHumanos/seleccion_contratacion_personal/tipo-puesto-trabajo/infraestructure/TipoPuestoTrabajoController'
import { Conocimiento } from '../domain/Conocimiento'
import { FormacionAcademica } from '../domain/FormacionAcademica'
import { configuracionColumnasSolicitudPuestoEmpleo } from '../domain/configuracionColumnasSolicitudPuestoEmpleo'
import { configuracionColumnasConocimientoReactive } from '../domain/configuracionColumnasConocimientoReactive'
import { configuracionColumnasFormacionAcademicaReactive } from '../domain/configuracionColumnasFormacionAcademicaReactive'
import { ComportamientoModalesSolicitudDePersonal } from '../application/ComportamientoModalesSolicitudDePersonal'
import { aniosExperiencia, tabOptionsSolicitudesPersonal } from 'config/seleccionContratacionPersonal.utils'
import { AreaConocimiento } from '../../areasConocimiento/domain/AreaConocimiento'
import { AreaConocimientoController } from '../../areasConocimiento/infraestructure/AreaConocimientoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useRouter } from 'vue-router'
import { useSeleccionContratacionStore } from 'stores/recursosHumanos/seleccionContratacion'

export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialEditor, EssentialTable, GestorArchivos, LabelAbrirModal, ModalEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(SolicitudPuestoEmpleo, new SolicitudPuestoEmpleoController())
    const { entidad: solicitud, accion, disabled, listadosAuxiliares, } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onReestablecer, onGuardado, onConsultado } = mixin.useHooks()
    const { confirmar } = useNotificaciones()

    const refArchivo = ref()
    const idPuestoEmpleo = ref()

    /****************************************************************************
     * stores
    ****************************************************************************/
    const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()
    const solicitudStore = useSeleccionContratacionStore()


    const modales = new ComportamientoModalesSolicitudDePersonal()


    const router = useRouter()
    const tipos_puestos_trabajo = ref([])
    const anios_experiencia = ref(aniosExperiencia)
    const autorizaciones = ref([])
    const areasConocimiento = ref()
    const tabActual = ref('1')

    const { cargos, filtrarCargos } =
      useFiltrosListadosSelects(listadosAuxiliares)

    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    /****************************************************************************
     * HOOKS
    ****************************************************************************/
    onGuardado((id: number) => {
      idPuestoEmpleo.value = id
      setTimeout(() => {
        subirArchivos()
      }, 1)
    })

    cargarVista(async () => {
      await obtenerListados({
        tipos_puestos_trabajo: {
          controller: new TipoPuestoTrabajoController(),
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
        cargos: {
          controller: new CargoController(),
          params: { estado: 1 },
        },
      })
      tipos_puestos_trabajo.value = listadosAuxiliares.tipos_puestos_trabajo
      autorizaciones.value = listadosAuxiliares.autorizaciones
      cargos.value = listadosAuxiliares.cargos
    })

    /****************************************************************************
     * REGLAS DE VALIDACION
    ****************************************************************************/

    const reglas = {
      nombre: { requiredIf: requiredIf(() => solicitud.tipo_puesto == tipo_puesto.nuevo), },
      tipo_puesto: { required },
      autorizacion: { requiredIf: requiredIf(() => store.esGerente) },
      descripcion: { required },
      anios_experiencia: { required: requiredIf(() => solicitud.requiere_experiencia) },
      conocimientos: { required: requiredIf(() => solicitud.tipo_puesto !== tipo_puesto.nuevo) },
      formaciones_academicas: { required },
      cargo: { requiredIf: requiredIf(() => solicitud.tipo_puesto !== tipo_puesto.nuevo), },
    }

    const v$ = useVuelidate(reglas, solicitud)
    setValidador(v$.value)

    function cambiarTipoPuesto() {
      solicitud.cargo = null
    }

    const btnEliminarPuestoEmpleo: CustomActionTable<Conocimiento> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      // visible: () => store.can('puede.eliminar.conocimientos'),
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => solicitud.conocimientos?.splice(posicion, 1))
    }
    const btnEliminarFormacionAcademica: CustomActionTable<FormacionAcademica> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      // visible: () => store.can('puede.eliminar.formaciones_academicas'),
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => solicitud.formaciones_academicas?.splice(posicion, 1))
    }

    async function filtrarSolicitudes(tab: string) {
      tabActual.value = tab
      switch (tab) {
        case '1':// PENDIENTES
          listar({
            'autorizacion_id': 1,
          })
          break
        case '2': //APROBADAS
          listar({
            publicada: 0,
            'autorizacion_id': 2,

          })
          break
        case '3': //CANCELADAS
          listar({ 'autorizacion_id': 3 })
          break
        case '4': // PUBLICADAS
          listar({
            publicada: 1,
            'autorizacion_id': 2,
          })
          break
        default:
          listar()
      }
    }

    async function guardado(data) {
      if (data.formulario === 'CrearCargoPage') {
        listadosAuxiliares.cargos.push(data.modelo)
      }
    }
    function agregarConocimiento() {
      const fila = new Conocimiento()
      fila.id = solicitud.conocimientos?.length
        ? encontrarUltimoIdListado(solicitud.conocimientos) + 1
        : 1
      solicitud.conocimientos?.push(fila)
    }
    function agregarFormacionAcademica() {
      const fila = new FormacionAcademica()
      fila.id = solicitud.formaciones_academicas?.length
        ? encontrarUltimoIdListado(solicitud.formaciones_academicas) + 1
        : 1
      solicitud.formaciones_academicas?.push(fila)
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

    async function crearAreaConocimientoBD(nombre: string) {
      cargando.activar()
      const conocimiento = new AreaConocimiento()
      conocimiento.cargo = solicitud.cargo
      conocimiento.nombre = nombre
      const result = await new AreaConocimientoController().guardar(conocimiento)
      console.log(result)
      cargando.desactivar()
      return result.response.data.modelo
    }

    async function crearAreaConocimiento(val, done) {
      if (val.length > 0) {
        val = val.toUpperCase()
        if (!areasConocimiento.value.map(v => v.nombre).includes(val)) {
          //Si no está en el array, se procede a crear en la BD y a setear la respuesta al listado
          const nuevoConocimiento = await crearAreaConocimientoBD(val)
          console.log(nuevoConocimiento, val)
          // se agrega el resultado al listado para mantener actualizado
          listadosAuxiliares.areasConocimiento.push(nuevoConocimiento)
          // se agrega el id del resultado obtenido para que no seleccione un null o un object
          solicitud.areas_conocimiento.push(nuevoConocimiento.id)
          done(val, 'add-unique')
          console.log('187', solicitud.areas_conocimiento)
          // Se filtra el listado de seleccionados para limpiar los nulos y undefined
          solicitud.areas_conocimiento = solicitud.areas_conocimiento.filter(v => v !== null)
          solicitud.areas_conocimiento = solicitud.areas_conocimiento.filter(v => v !== undefined)
        }
      }
    }
    function filtrarAreasConocimiento(val, update) {
      val = val.toUpperCase()
      update(() => {
        if (val == '') areasConocimiento.value = listadosAuxiliares.areasConocimiento
        else {
          areasConocimiento.value = listadosAuxiliares.areasConocimiento.filter((v: AreaConocimiento) => v.nombre!.toUpperCase().indexOf(val) > -1)
        }
      })
    }
    async function consultarConocimientos(val) {
      solicitud.areas_conocimiento = []
      cargando.activar()
      const response = await (await new AreaConocimientoController().listar({ cargo_id: val }))
      listadosAuxiliares.areasConocimiento = response.result //.map(v => v.nombre)
      areasConocimiento.value = listadosAuxiliares.areasConocimiento
      cargando.desactivar()
    }

    /****************************************************************************
     * BOTONES DE TABLA
     ****************************************************************************/
    const btnPublicar: CustomActionTable = {
      titulo: 'Publicar',
      icono: 'bi-pencil-square',
      color: 'primary',
      tooltip: 'Publicar oferta laboral',
      accion: ({ entidad }) => {
        console.log('Diste clic en el boton publicar')
        //ruta de publicacion de ofertas
        solicitudStore.idSolicitudVacante = entidad.id
        router.push('vacantes')
      },
      visible: () => { return accion.value == acciones.nuevo || accion.value == acciones.editar }
    }


    return {
      removeAccents,
      btnEliminarPuestoEmpleo,
      btnEliminarFormacionAcademica,
      agregarConocimiento,
      agregarFormacionAcademica,
      solicitud,
      mixin,
      disabled,
      accion,
      v$,
      acciones,
      accionesTabla,
      configuracionColumnas: configuracionColumnasSolicitudPuestoEmpleo,
      configuracionColumnasConocimientoReactive,
      configuracionColumnasFormacionAcademicaReactive,
      refArchivo,
      tipos_puestos_trabajo,
      autorizaciones,
      modales,
      tabOptionsSolicitudesPersonal,
      tabActual,


      // listados
      cargos, filtrarCargos,
      anios_experiencia, filtrarAniosExperiencia,
      areasConocimiento, filtrarAreasConocimiento,

      tipo_puesto,

      store,

      // funciones
      filtrarSolicitudes,
      cambiarTipoPuesto,
      guardado,
      consultarConocimientos,
      crearAreaConocimiento,

      //botones de tabla
      btnPublicar,

    }
  },
})
