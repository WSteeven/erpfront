// Dependencias
import { configuracionColumnasConfiguracionCuestionarioEmpleado } from '../domain/configuracionColumnasConfiguracionCuestionarioEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ConfiguracionCuestionarioEmpleado } from '../domain/ConfiguracionCuestionarioEmpleado'
import { removeAccents } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { useAuthenticationStore } from 'stores/authentication'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ConfiguracionCuestionarioEmpleadoController } from '../infraestructure/ConfiguracionCuestionarioEmpleadoController'

export default defineComponent({
  components: { TabLayout },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(ConfiguracionCuestionarioEmpleado, new ConfiguracionCuestionarioEmpleadoController())


    const { entidad: configuracion_cuestionario_empleado, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const store = useAuthenticationStore()
    const esRecursosHumanos = store.esRecursosHumanos
    const esAutorizador = ref(false)
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const auxmes = ref()
    //Reglas de validacion
    const reglas = {
      fecha_hora_inicio: { required },
      fecha_hora_fin: { required },
    }
    const v$ = useVuelidate(reglas, configuracion_cuestionario_empleado)
    setValidador(v$.value)


    return {
      removeAccents,
      mixin,
      configuracion_cuestionario_empleado,
      watchEffect,
      esAutorizador,
      esRecursosHumanos,
      esNuevo,
      accion,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasConfiguracionCuestionarioEmpleado,
    }
  },
})
