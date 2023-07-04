// Dependencias
import { configuracionColumnasPermisoEmpleado } from '../domain/configuracionColumnasPermisoEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { PermisoEmpleado } from '../domain/PermisoEmpleado'
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
import { ArchivoPermisoEmpleadoController } from '../infraestructure/ArchivoPermisoEmpleadoController'
import { useAuthenticationStore } from 'stores/authentication'
import { LocalStorage } from 'quasar'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen, GestorDocumentos },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      PermisoEmpleado,
      new PermisoEmpleadoController()
    )
    const mixinArchivoPrestamoEmpleado = new ContenedorSimpleMixin(
      Archivo,
      new ArchivoPermisoEmpleadoController()
    )

    const {
      entidad: permiso,
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

    const tipos_permisos = ref([])
    const empleados = ref([])
    const refArchivoPrestamoEmpresarial = ref()
    const autorizaciones = ref()
    const esAutorizador = store.user.jefe_id //computed(() => store.can('puede.autorizar.permiso_empleado') )
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const dias_permiso = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = convertir_fecha(permiso.fecha_hora_inicio)
        const fechaFin = convertir_fecha(permiso.fecha_hora_fin)
        // Calcula la diferencia en dias
        const diferenciaDias = fechaFin.getDate() - fechaInicio.getDate()
        return diferenciaDias
      } else {
        return 0
      }
    })
    const horas_permisos = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = convertir_fecha(permiso.fecha_hora_inicio)
        const fechaFin = convertir_fecha(permiso.fecha_hora_fin)
        // Calcula la diferencia en milisegundos
        const diferenciaMilisegundos =
          fechaFin.getTime() - fechaInicio.getTime()
        // Calcula la diferencia en horas
        const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60)
        return diferenciaHoras
      } else {
        return 0
      }
    })
    function optionsFecha(date) {
      const fechaActual = convertir_fecha(permiso.fecha_hora_inicio)
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
      permiso.tieneDocumento =
        refArchivoPrestamoEmpresarial.value.tamanioListado > 0 ? true : false
      if (!permiso.tieneDocumento) {
        notificarAdvertencia('Debe seleccionar al menos un archivo.')
      }
    })
    onBeforeModificar(() => {
      permiso.tieneDocumento = true
    })
    onGuardado((id: number) => {
      subirArchivos(id)
      emit('cerrar-modal')
    })
    async function subirArchivos(id: number) {
      await refArchivoPrestamoEmpresarial.value.subir({ permiso_id: id })
    }
    onConsultado(() => {
      setTimeout(() => {
        refArchivoPrestamoEmpresarial.value.listarArchivos({
          permiso_id: permiso.id,
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
        tipos_permisos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
      tipos_permisos.value = listadosAuxiliares.tipos_permisos
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
      tipo_permiso: { required },
      fecha_hora_inicio: { required },
      fecha_hora_fin: { required },
      fecha_recuperacion: {
        required: requiredIf(() => permiso.recuperables == true),
      },
      hora_recuperacion: {
        required: requiredIf(() => permiso.recuperables == true),
      },
      justificacion: { required },
      observacion: { required: requiredIf(() => esAutorizador.value) },
    }

    const v$ = useVuelidate(reglas, permiso)
    setValidador(v$.value)
    let tabPermisoEmpleado = '1'
    function filtrarPermisoEmpleado(tabSeleccionado: string) {
      listar({ estado_permiso_id: tabSeleccionado }, false)
      tabPermisoEmpleado = tabSeleccionado
    }

    return {
      removeAccents,
      mixin,
      permiso,
      optionsFecha,
      filtrarEmpleados,
      filtrarPermisoEmpleado,
      watchEffect,
      esAutorizador,
      esNuevo,
      verEmpleado,
      refArchivoPrestamoEmpresarial,
      mixinArchivoPrestamoEmpleado,
      endpoint: endpoints.archivo_permiso_empleado,
      tipos_permisos,
      dias_permiso,
      horas_permisos,
      empleados,
      autorizaciones,
      accion,
      maskFecha,
      v$,
      disabled,
      tabOptionsSolicitudPedido,
      configuracionColumnas: configuracionColumnasPermisoEmpleado,
    }
  },
})
