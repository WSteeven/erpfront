// Dependencias
import { configuracionColumnasLicenciaEmpleado } from '../domain/configuracionColumnasLicenciaEmpleado'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { LicenciaEmpleado } from '../domain/LicenciaEmpleado'
import { obtenerFechaActual, removeAccents, sumarFechas } from 'shared/utils'
import { maskFecha, tabOptionsLicencias } from 'config/utils'
import { endpoints } from 'config/api'
import { format, addDay } from '@formkit/tempo'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { ArchivoLicenciaEmpleadoController } from '../infraestructure/ArchivoLicenciaEmpleadoController'
import { TipoLicenciaController } from 'pages/recursosHumanos/tipo-licencia/infraestructure/TipoLicenciaController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen, GestorDocumentos },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(LicenciaEmpleado, new PermisoEmpleadoController())
    const mixinArchivoPrestamoEmpleado = new ContenedorSimpleMixin(Archivo, new ArchivoLicenciaEmpleadoController())
    const { entidad: licencia, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado, onGuardado, onBeforeModificar, onReestablecer } = mixin.useHooks()
    const store = useAuthenticationStore()
    const { notificarAdvertencia } = useNotificaciones()

    const tipos_licencias = ref([])
    const refArchivoPrestamoEmpresarial = ref()
    const autorizaciones = ref()
    const esRecursosHumanos = store.esRecursosHumanos
    let tabPermisoEmpleado = '1'

    const es_jefe_inmediato = ref(false)
    const tiene_dias_licencia = ref(false)
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => accion.value === 'NUEVO')
    function obtenerDiasLicencia() {
      const licencia_filtrada = listadosAuxiliares.tipos_licencias.filter(
        (v) => v.id == licencia.tipo_licencia
      )
      if (licencia_filtrada[0].num_dias > 0) {
        licencia.dias_licencia = licencia_filtrada[0].num_dias
        tiene_dias_licencia.value = true
      } else {
        licencia.dias_licencia = null
        licencia.fecha_fin = null
        tiene_dias_licencia.value = false
      }
    }
    onBeforeGuardar(() => {
      licencia.tieneDocumento =
        refArchivoPrestamoEmpresarial.value.tamanioListado > 0 ? true : false
      if (!licencia.tieneDocumento) {
        notificarAdvertencia('Debe seleccionar al menos un archivo.')
      }
    })
    onBeforeModificar(() => {
      licencia.tieneDocumento = true
    })
    onGuardado((id: number) => {
      subirArchivos(id)
      emit('cerrar-modal')
    })
    onConsultado(() => {
      es_jefe_inmediato.value = store.user.id == licencia.id_jefe_inmediato ? true : false
      setTimeout(() => {
        refArchivoPrestamoEmpresarial.value.listarArchivos({ licencia_id: licencia.id })
        refArchivoPrestamoEmpresarial.value.esConsultado = true
      }, 2000)
    })
    onReestablecer(() => {
      setTimeout(() => {
        refArchivoPrestamoEmpresarial.value.limpiarListado()
        refArchivoPrestamoEmpresarial.value.esConsultado = false
      }, 1000)
    })

    cargarVista(async () => {
      await obtenerListados({
        tipos_licencias: new TipoLicenciaController(),
        autorizaciones: {
          controller: new AutorizacionController(),
          params: {
            campos: 'id,nombre',
            es_modulo_rhh: true,
            es_jefe_inmediato: store.user.id == licencia.id_jefe_inmediato ? true : false,
          },
        },
      })
      tipos_licencias.value = listadosAuxiliares.tipos_licencias
      autorizaciones.value = listadosAuxiliares.autorizaciones
    })
    //Reglas de validacion
    const reglas = {
      tipo_licencia: { required },
      fecha_inicio: { required },
      fecha_fin: { required },
      justificacion: { required },
    }

    const v$ = useVuelidate(reglas, licencia)
    setValidador(v$.value)

    async function subirArchivos(id: number) {
      await refArchivoPrestamoEmpresarial.value.subir({ licencia_id: id })
    }
    function filtrarPermisoEmpleado(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado })
      tabPermisoEmpleado = tabSeleccionado
    }
    
    watchEffect(() => {
      if (licencia.fecha_inicio && licencia.dias_licencia) {
        licencia.fecha_fin = sumarFechas(format(licencia.fecha_inicio, 'DD-MM-YYYY'),0,0, Number(licencia.dias_licencia), maskFecha)
      }
    })

    function optionsFechaInicio(date) {
      const currentDate = sumarFechas(obtenerFechaActual(), 0, 0, -15, 'YYYY/MM/DD')
      return date >= currentDate
    }

    return {
      removeAccents,
      mixin,
      licencia,
      optionsFechaInicio,
      filtrarPermisoEmpleado,
      watchEffect,
      es_jefe_inmediato,
      esRecursosHumanos,
      esNuevo,
      verEmpleado,
      refArchivoPrestamoEmpresarial,
      mixinArchivoPrestamoEmpleado,
      endpoint: endpoints.archivo_licencia_empleado,
      tipos_licencias,
      tiene_dias_licencia,
      obtenerDiasLicencia,
      tabPermisoEmpleado,
      autorizaciones,
      accion,
      maskFecha,
      v$,
      disabled,
      tabOptionsLicencias,
      configuracionColumnas: configuracionColumnasLicenciaEmpleado,
    }
  },
})
