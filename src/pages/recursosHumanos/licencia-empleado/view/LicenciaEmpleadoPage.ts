// Dependencias
import { configuracionColumnasLicenciaEmpleado } from '../domain/configuracionColumnasLicenciaEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { LicenciaEmpleado } from '../domain/LicenciaEmpleado'
import { removeAccents } from 'shared/utils'
import { maskFecha, tabOptionsSolicitudPedido } from 'config/utils'
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { useAuthenticationStore } from 'stores/authentication'
import { LocalStorage } from 'quasar'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ArchivoLicenciaEmpleadoController } from '../infraestructure/ArchivoLicenciaEmpleadoController'

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
    const esRecursosHumanos = store.esRecursosHumanos;

    const esAutorizador = ref(false)
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const dias_licencia = computed(() => {
      if (licencia.fecha_inicio != null && licencia.fecha_fin != null) {
        const fechaInicio = convertir_fecha(licencia.fecha_inicio)
        const fechaFin = convertir_fecha(licencia.fecha_fin)
        // Calcula la diferencia en dias
        const diferenciaDias = fechaFin.getDate() - fechaInicio.getDate()
        return diferenciaDias
      } else {
        return 0
      }
    })

    function optionsFecha(date) {
      const fechaActual = convertir_fecha(licencia.fecha_inicio)
      const fechaIngresada = new Date(date)
      const diferenciaMilisegundos =
        fechaIngresada.getTime() - fechaActual.getTime()
      const diferenciaDias = Math.floor(
        diferenciaMilisegundos / (1000 * 60 * 60 * 24)
      ) // Diferencia en días
      console.log(diferenciaDias);

      return diferenciaDias === -1|| diferenciaDias === 0  || diferenciaDias === 1 || diferenciaDias === 2
    }
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
        tipos_licencias: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
      tipos_licencias.value = listadosAuxiliares.tipos_licencias
      autorizaciones.value =
        LocalStorage.getItem('autorizaciones') == null
          ? []
          : JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
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
      listar({ estado_licencia_id: tabSeleccionado }, false)
      tabPermisoEmpleado = tabSeleccionado
    }

    return {
      removeAccents,
      mixin,
      licencia,
      optionsFecha,
      filtrarEmpleados,
      filtrarPermisoEmpleado,
      watchEffect,
      esAutorizador,
      esRecursosHumanos,
      esNuevo,
      verEmpleado,
      refArchivoPrestamoEmpresarial,
      mixinArchivoPrestamoEmpleado,
      endpoint: endpoints.archivo_licencia_empleado,
      tipos_licencias,
      dias_licencia,
      empleados,
      autorizaciones,
      accion,
      maskFecha,
      v$,
      disabled,
      tabOptionsSolicitudPedido,
      configuracionColumnas: configuracionColumnasLicenciaEmpleado,
    }
  },
})
