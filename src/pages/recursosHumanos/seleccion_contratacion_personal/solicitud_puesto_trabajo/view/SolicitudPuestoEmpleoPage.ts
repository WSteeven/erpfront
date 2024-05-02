// Dependencias
import { configuracionColumnasSolicitudPuestoEmpleo } from '../domain/configuracionColumnasSolicitudPuestoEmpleo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';


//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SolicitudPuestoEmpleoController } from '../infraestructure/SolicitudPuestoEmpleoController'
import { SolicitudPuestoEmpleo } from '../domain/SolicitudPuestoEmpleo'
import { removeAccents } from 'shared/utils'
import { acciones, accionesTabla, estadosTransacciones, rolesSistema, tabOptionsPedidos } from 'config/utils'


export default defineComponent({
  components: { TabLayout, EssentialEditor,GestorArchivos },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      SolicitudPuestoEmpleo,
      new SolicitudPuestoEmpleoController()
    )
    const { entidad: solicitudPuestoEmpleo,accion, disabled } = mixin.useReferencias()

    const { setValidador } = mixin.useComportamiento()
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

    return {
      removeAccents,
      solicitudPuestoEmpleo,
      mixin,
      disabled,
      accion,
      v$,
      acciones,
      accionesTabla,
      configuracionColumnas: configuracionColumnasSolicitudPuestoEmpleo,
      refArchivo,
    }
  },
})
