// Dependencias
import { configuracionColumnasSolicitudPuestoEmpleo } from '../domain/configuracionColumnasSolicitudPuestoEmpleo'
import { required,requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SolicitudPuestoEmpleoController } from '../infraestructure/SolicitudPuestoEmpleoController'
import { SolicitudPuestoEmpleo } from '../domain/SolicitudPuestoEmpleo'
import { encontrarUltimoIdListado, removeAccents } from 'shared/utils'
import { acciones, accionesTabla } from 'config/utils'
import { TipoPuestoTrabajoController } from '../../tipo-puesto-trabajo/infraestructure/TipoPuestoTrabajoController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasConocimientoReactive } from '../domain/configuracionColumnasConocimientoReactive'
import { configuracionColumnasFormacionAcademicaReactive } from '../domain/configuracionColumnasFormacionAcademicaReactive'
import { tipo_puesto } from 'config/recursosHumanos.utils'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { useAuthenticationStore } from 'stores/authentication'
import { Conocimiento } from '../domain/Conocimiento'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { FormacionAcademica } from '../domain/FormacionAcademica'

export default defineComponent({
  components: { TabLayout, EssentialEditor, EssentialTable, GestorArchivos },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      SolicitudPuestoEmpleo,
      new SolicitudPuestoEmpleoController()
    )
    const {
      entidad: solicitudPuestoEmpleo,
      accion,
      disabled,
      listadosAuxiliares,
    } = mixin.useReferencias()

    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const { onReestablecer, onGuardado, onConsultado } = mixin.useHooks()
    const { confirmar } = useNotificaciones()

    const refArchivo = ref()
    const idPuestoEmpleo = ref()
    const authenticationStore = useAuthenticationStore()

    //Reglas de validacion
    const reglas = {
      nombre: {
        requiredIfNombre: requiredIf(
          () => solicitudPuestoEmpleo.tipo_puesto == tipo_puesto.nuevo
        ),
      },
      tipo_puesto: { required },
      autorizacion: { requiredIfAutorizacion:requiredIf(()=> authenticationStore.esGerente ) },
      descripcion: { required },
      anos_experiencia: { required },
      conocimientos: { required },
      formaciones_academicas: { required },
      puesto: {
        requiredIfpuesto: requiredIf(
          () => solicitudPuestoEmpleo.tipo_puesto !== tipo_puesto.nuevo
        ),
      },
    }

    const v$ = useVuelidate(reglas, solicitudPuestoEmpleo)
    const tipos_puestos_trabajo = ref([])
    const autorizaciones = ref([])
    const { cargos, filtrarCargos } =
      useFiltrosListadosSelects(listadosAuxiliares)

    setValidador(v$.value)
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

    function cambiarTipoPuesto() {
      solicitudPuestoEmpleo.puesto = null
    }

    const  btnEliminarPuestoEmpleo: CustomActionTable<Conocimiento>  = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      visible: () => authenticationStore.can('puede.eliminar.conocimientos'),
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => solicitudPuestoEmpleo.conocimientos?.splice(posicion, 1))
    }
    const btnEliminarFormacionAcademica: CustomActionTable<FormacionAcademica>  = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      visible: () => authenticationStore.can('puede.eliminar.formaciones_academicas'),
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => solicitudPuestoEmpleo.formaciones_academicas?.splice(posicion, 1))
    }
    function agregarConocimiento() {
      const fila = new Conocimiento()
      fila.id = solicitudPuestoEmpleo.conocimientos?.length
        ? encontrarUltimoIdListado(solicitudPuestoEmpleo.conocimientos) + 1
        : 1
      solicitudPuestoEmpleo.conocimientos?.push(fila)
    }
    function agregarFormacionAcademica() {
      const fila = new FormacionAcademica()
      fila.id = solicitudPuestoEmpleo.formaciones_academicas?.length
        ? encontrarUltimoIdListado(solicitudPuestoEmpleo.formaciones_academicas) + 1
        : 1
      solicitudPuestoEmpleo.formaciones_academicas?.push(fila)
    }
    return {
      removeAccents,
      btnEliminarPuestoEmpleo,
      btnEliminarFormacionAcademica,
      agregarConocimiento,
      agregarFormacionAcademica,
      solicitudPuestoEmpleo,
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
      cargos,
      tipo_puesto,
      cambiarTipoPuesto,
      filtrarCargos,
      authenticationStore,
    }
  },
})
