// Dependencias
import { configuracionColumnasSolicitudPuestoEmpleo } from '../domain/configuracionColumnasSolicitudPuestoEmpleo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SolicitudPuestoEmpleoController } from '../infraestructure/SolicitudPuestoEmpleoController'
import { SolicitudPuestoEmpleo } from '../domain/SolicitudPuestoEmpleo'
import { removeAccents } from 'shared/utils'
import {
  acciones,
  accionesTabla,
  estadosTransacciones,
  rolesSistema,
  tabOptionsPedidos,
} from 'config/utils'
import { TipoPuestoTrabajoController } from '../../tipo-puesto-trabajo/infraestructure/TipoPuestoTrabajoController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasConocimientoReactive } from '../domain/configuracionColumnasConocimientoReactive'
import { configuracionColumnasFormacionAcademicaReactive } from '../domain/configuracionColumnasFormacionAcademicaReactive'

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

    const refArchivo = ref()
    const idPuestoEmpleo = ref()

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      tipo_puesto: { required },
      autorizacion: { required },
      descripcion_vacante: { required },
      anios_experiencia: { required },
      conocimientos: { required },
      formaciones_academicas: { required },
    }

    const v$ = useVuelidate(reglas, solicitudPuestoEmpleo)
    const tipos_puestos_trabajo = ref([])
    const autorizaciones = ref([])

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
      })
      tipos_puestos_trabajo.value = listadosAuxiliares.tipos_puestos_trabajo
      autorizaciones.value = listadosAuxiliares.autorizaciones
    })

    function btnEliminarPuestoEmpleo() {
      console.log('eliminar')
    }
    function btnEliminarFormacionAcademica() {
      console.log('eliminar')
    }
    function agregarDiscapacidad() {
      console.log('agregar')
    }
    function agregarFormacionAcademica() {
      console.log('agregar')
    }
    return {
      removeAccents,
      btnEliminarPuestoEmpleo,
      btnEliminarFormacionAcademica,
      agregarDiscapacidad,
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
    }
  },
})
