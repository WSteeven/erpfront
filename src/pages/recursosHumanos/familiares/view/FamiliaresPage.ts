// Dependencias
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Familiares } from '../domain/Familiares'
import { removeAccents } from 'shared/utils'
import {
  required,
} from 'shared/i18n-validators'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useAuthenticationStore } from 'stores/authentication'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { FamiliaresController } from '../infraestructure/FamiliaresController'
import { configuracionColumnasFamiliares } from '../domain/configuracionColumnasFamiliares'

export default defineComponent({
  components: { TabLayout, SelectorImagen, GestorDocumentos },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      Familiares,
      new FamiliaresController()
    )

    const {
      entidad: familiares,
      disabled,
      accion,
      listado,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const {
      onBeforeGuardar,
      onGuardado,
      onBeforeModificar,
      onModificado,
      onConsultado,
      onReestablecer,
    } = mixin.useHooks()
    const store = useAuthenticationStore()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()

    const empleados = ref([])
    const autorizaciones = ref()
    const esRecursosHumanos = store.esRecursosHumanos

    const esAutorizador = ref(false)
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
    })
    function filtrarEmpleados(val, update) {
      if (val === '')
        update(() => (empleados.value = listadosAuxiliares.empleados))

      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    //Reglas de validacion
    const reglas = {
      nombres: { required },
      apellidos: { required },
      parentezco: { required },
      identificacion: { required },
    }
    const v$ = useVuelidate(reglas, familiares)
    setValidador(v$.value)
    return {
      removeAccents,
      mixin,
      familiares,
      filtrarEmpleados,
      esAutorizador,
      esRecursosHumanos,
      esNuevo,
      verEmpleado,
      empleados,
      accion,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasFamiliares,

    }
  },
})
