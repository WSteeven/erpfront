// Dependencias
import { configuracionColumnasLicenciaEmpleado } from '../domain/configuracionColumnasLicenciaEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { LicenciaEmpleado } from '../domain/LicenciaEmpleado'
import { removeAccents } from 'shared/utils'
import { maskFecha, tabOptionsLicencias } from 'config/utils'
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { useAuthenticationStore } from 'stores/authentication'
import { LocalStorage } from 'quasar'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ArchivoLicenciaEmpleadoController } from '../infraestructure/ArchivoLicenciaEmpleadoController'
import { TipoLicenciaController } from 'pages/recursosHumanos/tipo-licencia/infraestructure/TipoLicenciaController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen, GestorDocumentos },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      LicenciaEmpleado,
      new PermisoEmpleadoController()
    )
    const mixinArchivoPrestamoEmpleado = new ContenedorSimpleMixin(
      Archivo,
      new ArchivoLicenciaEmpleadoController()
    )

    const {
      entidad: licencia,
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

    const tipos_licencias = ref([])
    const empleados = ref([])
    const refArchivoPrestamoEmpresarial = ref()
    const autorizaciones = ref()
    const esRecursosHumanos = store.esRecursosHumanos

    const es_jefe_inmediato = ref(false)
    const tiene_dias_licencia = ref(false)
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    function obtener_dias_licencia() {
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
    function optionsFecha(date) {
      const fechaActual = convertir_fecha(licencia.fecha_inicio)
      const fechaIngresada = new Date(date)
      const diferenciaMilisegundos =
        fechaIngresada.getTime() - fechaActual.getTime()
      const diferenciaDias = Math.floor(
        diferenciaMilisegundos / (1000 * 60 * 60 * 24)
      ) // Diferencia en días
      return (
        diferenciaDias === -1 ||
        diferenciaDias === 0 ||
        diferenciaDias === 1 ||
        diferenciaDias === 2
      )
    }
    function convertir_fecha(fecha) {
      const dateParts = fecha.split('-') // Dividir el string en partes usando el guión como separador
      const dia = parseInt(dateParts[0], 10) // Obtener el día como entero
      const mes = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
      const anio = parseInt(dateParts[2], 10)
      const fecha_convert = new Date(anio, mes, dia, 0)
      return fecha_convert
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
    async function subirArchivos(id: number) {
      await refArchivoPrestamoEmpresarial.value.subir({ licencia_id: id })
    }
    onConsultado(() => {
      es_jefe_inmediato.value =
      store.user.id == licencia.id_jefe_inmediato ? true : false
        setTimeout(() => {
        refArchivoPrestamoEmpresarial.value.listarArchivos({
          licencia_id: licencia.id,
        })
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
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        autorizaciones: {
          controller: new AutorizacionController(),
          params: {
            campos: 'id,nombre',
            es_modulo_rhh:true,
            es_jefe_inmediato:
              store.user.id == licencia.id_jefe_inmediato ? true : false,
          },
        },
      })
      empleados.value = listadosAuxiliares.empleados
      tipos_licencias.value = listadosAuxiliares.tipos_licencias
      autorizaciones.value =listadosAuxiliares.autorizaciones
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
      tipo_licencia: { required },
      fecha_inicio: { required },
      fecha_fin: { required },
      justificacion: { required },
    }

    const v$ = useVuelidate(reglas, licencia)
    setValidador(v$.value)
    let tabPermisoEmpleado = '1'
    function filtrarPermisoEmpleado(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabPermisoEmpleado = tabSeleccionado
    }
    watchEffect(() => {
      if (
        licencia.fecha_inicio !== null &&
        licencia.dias_licencia !== null &&
        licencia.dias_licencia !== undefined
      ) {
        const fechaInicio = convertir_fecha(licencia.fecha_inicio)
        const fechaFinal = fechaInicio
        fechaFinal.setDate(
          fechaInicio.getDate() +
            parseInt(licencia.dias_licencia.toString()) -
            1
        )
        // Formatear la fecha a "año-mes-día"
        const anio = fechaFinal.getFullYear()
        const mes = ('0' + (fechaFinal.getMonth() + 1)).slice(-2)
        const dia = ('0' + fechaFinal.getDate()).slice(-2)
        licencia.fecha_fin = dia + '-' + mes + '-' + anio
      }
    })
    function optionsFechaInicio(date) {
      const currentDate = new Date() // Obtener la fecha actual
      const year = currentDate.getFullYear() // Obtener el año
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Obtener el mes y asegurarse de que tenga dos dígitos
      const day = String(currentDate.getDate()).padStart(2, '0') // Obtener el día y asegurarse de que tenga dos dígitos
      const currentDateString = `${year}/${month}/${day}` // Formatear la fecha actual
      return date >= currentDateString
    }

    return {
      removeAccents,
      mixin,
      licencia,
      optionsFecha,
      optionsFechaInicio,
      filtrarEmpleados,
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
      obtener_dias_licencia,
      empleados,
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
