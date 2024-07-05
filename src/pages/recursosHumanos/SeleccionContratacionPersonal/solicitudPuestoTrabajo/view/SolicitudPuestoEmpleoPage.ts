// Dependencias
import { required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { encontrarUltimoIdListado, removeAccents } from 'shared/utils'
import { acciones, accionesTabla } from 'config/utils'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
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

export default defineComponent({
  components: { TabLayout, EssentialEditor, EssentialTable, GestorArchivos },
  setup() {
    const mixin = new ContenedorSimpleMixin(SolicitudPuestoEmpleo, new SolicitudPuestoEmpleoController())
    const { entidad: solicitud, accion, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
    const { onReestablecer, onGuardado, onConsultado } = mixin.useHooks()
    const { confirmar } = useNotificaciones()

    const refArchivo = ref()
    const idPuestoEmpleo = ref()
    const authenticationStore = useAuthenticationStore()

    //Reglas de validacion
    const reglas = {
      nombre: { requiredIfNombre: requiredIf(() => solicitud.tipo_puesto == tipo_puesto.nuevo), },
      tipo_puesto: { required },
      autorizacion: { requiredIfAutorizacion: requiredIf(() => authenticationStore.esGerente) },
      descripcion: { required },
      anios_experiencia: { required },
      conocimientos: { required },
      formaciones_academicas: { required },
      puesto: { requiredIfpuesto: requiredIf(() => solicitud.tipo_puesto !== tipo_puesto.nuevo), },
    }

    const v$ = useVuelidate(reglas, solicitud)
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
      solicitud.puesto = null
    }

    const btnEliminarPuestoEmpleo: CustomActionTable<Conocimiento> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      visible: () => authenticationStore.can('puede.eliminar.conocimientos'),
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => solicitud.conocimientos?.splice(posicion, 1))
    }
    const btnEliminarFormacionAcademica: CustomActionTable<FormacionAcademica> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      visible: () => authenticationStore.can('puede.eliminar.formaciones_academicas'),
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => solicitud.formaciones_academicas?.splice(posicion, 1))
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
      cargos,
      tipo_puesto,
      cambiarTipoPuesto,
      filtrarCargos,
      authenticationStore,
    }
  },
})
