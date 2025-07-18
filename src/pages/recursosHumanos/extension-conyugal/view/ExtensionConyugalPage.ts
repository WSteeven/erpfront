// Dependencias
import { configuracionColumnasExtensionConyugal } from '../domain/configuracionColumnasExtensionConyugal'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ExtensionConyugal } from '../domain/ExtensionConyugal'
import { removeAccents } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ArchivoExtensionConyugalController } from '../infraestructure/ArchivoExtensionConyugalController'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ExtensionConyugalController } from '../infraestructure/ExtensionConyugalController'

export default defineComponent({
  components: { TabLayout, SelectorImagen, GestorDocumentos },
  emits: ['cerrar-modal'],
  setup() {
    const mixin = new ContenedorSimpleMixin(ExtensionConyugal, new ExtensionConyugalController())
    const mixinExtensionConyugal = new ContenedorSimpleMixin(Archivo, new ArchivoExtensionConyugalController())
    const { entidad: extensionconyugal, disabled, accion, } = mixin.useReferencias()
    const { setValidador, consultar, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onBeforeModificar, onReestablecer, } = mixin.useHooks()

    const store = useAuthenticationStore()
    const { notificarAdvertencia } = useNotificaciones()
    const is_month = ref(false)
    const refArchivoExtensionConyugal = ref()
    const esRecursosHumanos = store.esRecursosHumanos
    const esAutorizador = ref(false)
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const auxmes = ref()


    // function convertir_fecha(fecha) {
    //   const dateParts = fecha.split('-') // Dividir el string en partes usando el guión como separador
    //   let tiempo = dateParts[2]
    //   tiempo = tiempo.split(' ')
    //   tiempo = tiempo[1].split(':')
    //   const dia = parseInt(dateParts[0], 10) // Obtener el día como entero
    //   const mes = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
    //   const anio = parseInt(dateParts[2], 10)
    //   const fecha_convert = new Date(anio, mes, dia, tiempo[0], tiempo[1], 0)
    //   return fecha_convert
    // }
    onBeforeGuardar(() => {
      extensionconyugal.tieneDocumento =
        refArchivoExtensionConyugal.value.tamanioListado > 0
      if (!extensionconyugal.tieneDocumento) {
        notificarAdvertencia('Debe seleccionar al menos un archivo.')
      }
      auxmes.value = extensionconyugal.mes
    })
    onBeforeModificar(() => {
      extensionconyugal.tieneDocumento = true
    })
    onGuardado(async () => {
      await subirArchivos()
      await listar()
      // emit('cerrar-modal')
    })
    async function subirArchivos() {
      await refArchivoExtensionConyugal.value.subir({ mes: auxmes.value })
    }

    const limpiarArchivoExtensionConyugal = () => {
      const archivoExtensionConyugal = refArchivoExtensionConyugal.value;
      archivoExtensionConyugal.limpiarListado();
      archivoExtensionConyugal.quiero_subir_archivos = false;
      archivoExtensionConyugal.esConsultado = false;
      // Realizar cambios en la interfaz de usuario en el siguiente ciclo de renderizado
      requestAnimationFrame(() => {
        archivoExtensionConyugal.quiero_subir_archivos = true;
      });
    };

    onReestablecer(() => {
      setTimeout(limpiarArchivoExtensionConyugal, 50);
    });

    //Reglas de validacion
    const reglas = {
      mes: { required },
    }
    const v$ = useVuelidate(reglas, extensionconyugal)
    setValidador(v$.value)

    const editarPermiso: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) =>
        entidad.empleado !== store.user.id && !esRecursosHumanos,
      accion: ({ entidad }) => {
        accion.value = 'EDITAR'
        consultar(entidad)
      },
    }
    /**Verifica si es un mes */
    function checkValue(_:string, reason:string) {
      is_month.value = reason !== 'month'
    }

    return {
      removeAccents,
      mixin,
      extensionconyugal,
      is_month,
      checkValue,
      watchEffect,
      editarPermiso,
      esAutorizador,
      esRecursosHumanos,
      esNuevo,
      verEmpleado,
      refArchivoExtensionConyugal,
      mixinExtensionConyugal,
      endpoint: endpoints.archivo_extension_conyugal,
      accion,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasExtensionConyugal,
    }
  },
})
