// Dependencias
import { configuracionColumnasPrestamoHipotecario } from '../domain/configuracionColumnasPrestamoHipotecario'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PrestamoHipotecarioController } from '../infraestructure/PrestamoHipotecarioController'
import { PrestamoHipotecario } from '../domain/PrestamoHipotecario'
import { removeAccents } from 'shared/utils'
import { maskFecha, tabOptionsSolicitudPedido } from 'config/utils'
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ArchivoPrestamoHipotecarioController } from '../infraestructure/ArchivoPrestamoHipotecarioController'
import { useAuthenticationStore } from 'stores/authentication'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
  components: { TabLayout, SelectorImagen, GestorDocumentos },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      PrestamoHipotecario,
      new PrestamoHipotecarioController()
    )
    const mixinPrestamoHipotecario = new ContenedorSimpleMixin(
      Archivo,
      new ArchivoPrestamoHipotecarioController()
    )

    const {
      entidad: prestamo,
      disabled,
      accion,
      listado,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, consultar, cargarVista, obtenerListados, listar } =
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
    const is_month = ref(false)
    const refArchivoPrestamoHipotecario = ref()
    const esRecursosHumanos = store.esRecursosHumanos
    const esAutorizador = ref(false)
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
const auxmes = ref()


    function convertir_fecha(fecha) {
      const dateParts = fecha.split('-') // Dividir el string en partes usando el guión como separador
      let tiempo = dateParts[2]
      tiempo = tiempo.split(' ')
      tiempo = tiempo[1].split(':')
      const dia = parseInt(dateParts[0], 10) // Obtener el día como entero
      const mes = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
      const anio = parseInt(dateParts[2], 10)
      const fecha_convert = new Date(anio, mes, dia, tiempo[0], tiempo[1], 0)
      return fecha_convert
    }
    onBeforeGuardar(() => {
      prestamo.tieneDocumento =
        refArchivoPrestamoHipotecario.value.tamanioListado > 0 ? true : false
      if (!prestamo.tieneDocumento) {
        notificarAdvertencia('Debe seleccionar al menos un archivo.')
      }
      auxmes.value = prestamo.mes
    })
    onBeforeModificar(() => {
      prestamo.tieneDocumento = true
    })
    onGuardado((id: number) => {
      subirArchivos()
      emit('cerrar-modal')
    })
    async function subirArchivos() {
        await refArchivoPrestamoHipotecario.value.subir({ mes: auxmes.value })
    }

      const limpiarArchivoPrestamoHipotecario = () => {
      const archivoPrestamoHipotecario = refArchivoPrestamoHipotecario.value;
      archivoPrestamoHipotecario.limpiarListado();
      archivoPrestamoHipotecario.quiero_subir_archivos = false;
      archivoPrestamoHipotecario.esConsultado = false;
      // Realizar cambios en la interfaz de usuario en el siguiente ciclo de renderizado
     requestAnimationFrame(() => {
        archivoPrestamoHipotecario.quiero_subir_archivos = true;
      });
    };

    onReestablecer(() => {
      setTimeout(limpiarArchivoPrestamoHipotecario, 50);
    });
    //Reglas de validacion
    const reglas = {
      mes: { required },
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
      },
    }
     /**Verifica si es un mes */
     function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
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
      configuracionColumnas: configuracionColumnasPrestamoHipotecario,
    }
  },
})
