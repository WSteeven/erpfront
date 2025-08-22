// Dependencias
import { configuracionColumnasPrestamoHipotecario } from '../domain/configuracionColumnasPrestamoHipotecario'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import ErrorComponent from 'components/ErrorComponent.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PrestamoHipotecarioController } from '../infraestructure/PrestamoHipotecarioController'
import { PrestamoHipotecario } from '../domain/PrestamoHipotecario'
import { removeAccents } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ArchivoPrestamoHipotecarioController } from '../infraestructure/ArchivoPrestamoHipotecarioController'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
  components: { ErrorComponent, TabLayout, SelectorImagen, GestorDocumentos },
  emits: ['cerrar-modal'],
  setup() {
    const mixin = new ContenedorSimpleMixin(
      PrestamoHipotecario,
      new PrestamoHipotecarioController()
    )
    const mixinPrestamoHipotecario = new ContenedorSimpleMixin(
      Archivo,
      new ArchivoPrestamoHipotecarioController()
    )

    const { entidad: prestamo, disabled, accion } = mixin.useReferencias()
    const { setValidador, consultar, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onBeforeModificar, onReestablecer } =
      mixin.useHooks()
    const store = useAuthenticationStore()
    const { notificarAdvertencia } = useNotificaciones()
    const is_month = ref(false)
    const refArchivoPrestamoHipotecario = ref()
    const esRecursosHumanos = store.esRecursosHumanos
    const esAutorizador = ref(false)
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const auxmes = ref()
    onBeforeGuardar(() => {
      prestamo.tieneDocumento =
        refArchivoPrestamoHipotecario.value.tamanioListado > 0
      if (!prestamo.tieneDocumento) {
        notificarAdvertencia('Debe seleccionar al menos un archivo.')
      }
      auxmes.value = prestamo.mes
    })
    onBeforeModificar(() => {
      prestamo.tieneDocumento = true
    })
    onGuardado(() => {
      subirArchivos()
      listar()
    })
    async function subirArchivos() {
      await refArchivoPrestamoHipotecario.value.subir({ mes: auxmes.value })
    }

    const limpiarArchivoPrestamoHipotecario = () => {
      const archivoPrestamoHipotecario = refArchivoPrestamoHipotecario.value
      archivoPrestamoHipotecario.limpiarListado()
      archivoPrestamoHipotecario.quiero_subir_archivos = false
      archivoPrestamoHipotecario.esConsultado = false
      // Realizar cambios en la interfaz de usuario en el siguiente ciclo de renderizado
      requestAnimationFrame(() => {
        archivoPrestamoHipotecario.quiero_subir_archivos = true
      })
    }

    onReestablecer(() => {
      setTimeout(limpiarArchivoPrestamoHipotecario, 50)
    })
    //Reglas de validacion
    const reglas = {
      mes: { required }
    }
    const v$ = useVuelidate(reglas, prestamo)
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
      }
    }
    /**Verifica si es un mes */
    function checkValue(val, reason) {
      is_month.value = reason !== 'month'
    }

    return {
      removeAccents,
      mixin,
      prestamo,
      is_month,
      checkValue,
      watchEffect,
      editarPermiso,
      esAutorizador,
      esRecursosHumanos,
      esNuevo,
      verEmpleado,
      refArchivoPrestamoHipotecario,
      mixinPrestamoHipotecario,
      endpoint: endpoints.archivo_prestamo_hipotecario,
      accion,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPrestamoHipotecario
    }
  }
})
