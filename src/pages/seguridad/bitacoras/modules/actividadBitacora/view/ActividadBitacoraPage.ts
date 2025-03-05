// Dependencias
import { defineComponent, onMounted, ref, UnwrapRef } from 'vue'
import { required, requiredIf } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'

// Componentes
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'
import FormularioVisitante from '../../visitantes/view/FormularioVisitante.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import VoiceInput from 'components/inputs/VoiceInput.vue'

// Logica y controladores
import { TipoEventoBitacoraController } from 'pages/seguridad/tiposEventosBitacoras/infraestructure/TipoEventoBitacoraController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ActividadBitacora } from '../domain/ActividadBitacora'
import { acciones } from 'config/utils'
import { TipoEventoBitacora } from 'pages/seguridad/tiposEventosBitacoras/domain/TipoEventoBitacora'
import { obtenerTiempoActual } from 'shared/utils'

export default defineComponent({
  components: { SimpleLayout, VoiceInput, SelectorImagen, GestorArchivos, FormularioVisitante },
  props: {
    datos: Object as () => UnwrapRef<{ bitacora_id: number, mixin: ContenedorSimpleMixin<ActividadBitacora> }>,
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /********
    * Mixin
    ********/
    const { entidad: actividad, disabled, listadosAuxiliares, accion, listadoArchivos } = props.datos!!.mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar } = props.datos!!.mixin.useComportamiento()
    const { onGuardado, onModificado, onConsultado, onReestablecer, onBeforeGuardar } = props.datos!!.mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        tiposEventos: {
          controller: new TipoEventoBitacoraController(),
          params: { activo: 1 },
        },
      })
    })

    /************
     * Variables
     ************/
    const refArchivo = ref()
    const idEntidad = ref()

    /*********
     * Reglas
     *********/
    const rules = {
      tipo_evento_bitacora: { required },
      actividad: { required },
      visitante: {
        nombre_completo: { requiredIf: requiredIf(() => actividad.mostrar_seccion_visitante) },
        identificacion: { requiredIf: requiredIf(() => actividad.mostrar_seccion_visitante) },
        motivo_visita: { requiredIf: requiredIf(() => actividad.mostrar_seccion_visitante) },
        persona_visitada: { requiredIf: requiredIf(() => actividad.mostrar_seccion_visitante) },
      }
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, actividad)
    setValidador(v$.value)

    /************
     * Funciones
     ************/
    const subirArchivos = async () => await refArchivo.value.subir()
    const validarNotificacionInmediata = () => {
      actividad.notificacion_inmediata = listadosAuxiliares.tiposEventos.find((te: TipoEventoBitacora) => te.id === actividad.tipo_evento_bitacora).notificacion_inmediata
    }

    /********
     * Hooks
     ********/
    onGuardado((id: number) => {
      idEntidad.value = id
      setTimeout(async () => {
        await subirArchivos(), 1
        emit('cerrar-modal')
      })
    })

    onModificado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
    })

    onConsultado(async () => {
      setTimeout(async () => {
        await refArchivo.value.listarArchivosAlmacenados(actividad.id)
        actividad.mostrar_seccion_archivos_adjuntos = !!listadoArchivos.value.length
        actividad.mostrar_seccion_visitante = !!actividad.visitante?.id
        refArchivo.value.quiero_subir_archivos = false

      }, 1)
    })

    onReestablecer(() => {
      if (refArchivo.value) refArchivo.value.limpiarListado()
      obtenerTiempoActual().then(tiempo => actividad.fecha_hora_inicio = tiempo.fecha_hora)
      actividad.bitacora = props.datos?.bitacora_id ?? null
      refArchivo.value.quiero_subir_archivos = true
      // emit('cerrar-modal')
    })

    onBeforeGuardar(() => {
      actividad.visitante = actividad.mostrar_seccion_visitante ? actividad.visitante : null
    })

    /*******
     * Init
     *******/
    onMounted(() => {

      if (refArchivo.value) refArchivo.value.limpiarListado()
      if (accion.value === acciones.consultar) consultar(actividad)
      else {
        obtenerTiempoActual().then(tiempo => actividad.fecha_hora_inicio = tiempo.fecha_hora)
        actividad.bitacora = props.datos?.bitacora_id ?? null
      }
    })

    return {
      v$,
      mixin: props.datos?.mixin,
      actividad,
      disabled,
      listadosAuxiliares,
      refArchivo,
      accion,
      acciones,
      idEntidad, validarNotificacionInmediata,
      listadoArchivos,
    }
  }
})