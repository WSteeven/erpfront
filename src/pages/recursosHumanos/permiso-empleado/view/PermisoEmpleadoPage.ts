// Dependencias
import { configuracionColumnasPermisoEmpleado } from '../domain/configuracionColumnasPermisoEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { PermisoEmpleado } from '../domain/PermisoEmpleado'
import { removeAccents } from 'shared/utils'
import {
  convertir_fecha,
  convertir_fecha_guion,
  convertir_fecha_hora,
  maskFecha,
  tabOptionsPermiso,
} from 'config/utils'
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
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import ArchivoSeguimiento from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    SelectorImagen,
    GestorDocumentos,
    ArchivoSeguimiento,
  },
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

    const tipos_permisos = ref([])
    const empleados = ref([])
    const aux_fecha_inicio = ref()
    const aux_fecha_fin = ref()
    const refArchivoPrestamoEmpresarial = ref()
    const autorizaciones = ref()
    const esRecursosHumanos = store.esRecursosHumanos
    const esAutorizador = ref(false)
    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const dias_permiso = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = convertir_fecha_hora(permiso.fecha_hora_inicio)
        const fechaFin = convertir_fecha_hora(permiso.fecha_hora_fin)
        // Calcula la diferencia en dias
        const diferenciaDias = fechaFin.getDate() - fechaInicio.getDate()
        return diferenciaDias
      } else {
        return 0
      }
    })
    const horas_permisos = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = convertir_fecha_hora(permiso.fecha_hora_inicio)
        const fechaFin = convertir_fecha_hora(permiso.fecha_hora_fin)
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
      esAutorizador.value =
        store.user.id == permiso.id_jefe_inmediato ? true : false
      aux_fecha_inicio.value =
        permiso.fecha_hora_inicio == null ? '' : permiso.fecha_hora_inicio
      aux_fecha_fin.value =
        permiso.fecha_hora_fin == null ? '' : permiso.fecha_hora_fin
      setTimeout(() => {
        refArchivoPrestamoEmpresarial.value.listarArchivos({
          permiso_id: permiso.id,
        })
        refArchivoPrestamoEmpresarial.value.esConsultado = true
      }, 2000)
    })
    const limpiarArchivoPrestamoEmpresarial = () => {
      const archivoPrestamoEmpresarial = refArchivoPrestamoEmpresarial.value
      archivoPrestamoEmpresarial.limpiarListado()
      archivoPrestamoEmpresarial.quiero_subir_archivos = false
      archivoPrestamoEmpresarial.esConsultado = false
      // Realizar cambios en la interfaz de usuario en el siguiente ciclo de renderizado
      requestAnimationFrame(() => {
        archivoPrestamoEmpresarial.quiero_subir_archivos = true
      })
    }

    onReestablecer(() => {
      setTimeout(limpiarArchivoPrestamoEmpresarial, 50)
    })

    cargarVista(async () => {
      await obtenerListados({
        tipos_permisos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        autorizaciones: {
          controller: new AutorizacionController(),
          params: { campos: 'id,nombre', es_validado: false },
        },
      })

      empleados.value = listadosAuxiliares.empleados
      tipos_permisos.value = listadosAuxiliares.tipos_permisos
      autorizaciones.value = listadosAuxiliares.autorizaciones
    })
    function optionsFechaInicio(date) {
      const currentDate =
        permiso.fecha_hora_inicio != null
          ? convertir_fecha_hora(permiso.fecha_hora_inicio)
          : new Date() // Obtener la fecha actual
      const year = currentDate.getFullYear() // Obtener el año
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Obtener el mes y asegurarse de que tenga dos dígitos
      const day = String(currentDate.getDate()).padStart(2, '0') // Obtener el día y asegurarse de que tenga dos dígitos
      const currentDateString = `${year}/${month}/${day}` // Formatear la fecha actual
      return date >= currentDateString
    }
    function optionsFecha(date) {
      const fechaActual = convertir_fecha_hora(permiso.fecha_hora_inicio)
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

    function optionsFechaRecuperacion(date) {
      const fechaFin = convertir_fecha_guion(
        permiso.fecha_hora_fin !== null
          ? permiso.fecha_hora_fin
          : ' '
      )
      return date > fechaFin
    }
    function optionsFechaSugerida(date) {
      const fechaFin = convertir_fecha_guion(
        permiso.fecha_hora_fin !== null
          ? permiso.fecha_hora_fin
          : ' '
      )
      return date > fechaFin
    }
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

    const editarPermiso: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) => store.can('puede.editar.permiso_nomina'),
      accion: ({ entidad }) => {
        accion.value = 'EDITAR'
        consultar(entidad)
      },
    }

    function cambiar_fecha() {
      permiso.fecha_hora_inicio = aux_fecha_inicio.value
      permiso.fecha_hora_fin = aux_fecha_fin.value
      if (permiso.aceptar_sugerencia) {
        permiso.fecha_hora_inicio = permiso.fecha_hora_reagendamiento
        const fechaFinSugerida = convertir_fecha_hora(
          permiso.fecha_hora_reagendamiento
        ) //new Date(anio, mes, dia,parseInt(tiempo[1].split(':')[0]),parseInt(tiempo[1].split(':')[1]));
        fechaFinSugerida.setHours(fechaFinSugerida.getHours() + 1)
        const anio = fechaFinSugerida.getFullYear()
        const mes = String(fechaFinSugerida.getMonth() + 1).padStart(2, '0') // Los meses son base 0, por lo que sumamos 1
        const dia = String(fechaFinSugerida.getDate()).padStart(2, '0')
        const horas = String(fechaFinSugerida.getHours()).padStart(2, '0')
        const minutos = String(fechaFinSugerida.getMinutes()).padStart(2, '0')
        permiso.fecha_hora_fin =
          dia + '-' + mes + '-' + anio + ' ' + horas + ':' + minutos + ':00'
      }
    }

    return {
      removeAccents,
      mixin,
      permiso,
      optionsFecha,
      filtrarEmpleados,
      filtrarPermisoEmpleado,
      watchEffect,
      optionsFechaInicio,
      optionsFechaRecuperacion,
      optionsFechaSugerida,
      cambiar_fecha,
      editarPermiso,
      esAutorizador,
      esRecursosHumanos,
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
      store,
      v$,
      disabled,
      tabOptionsPermiso,
      configuracionColumnas: configuracionColumnasPermisoEmpleado,
    }
  },
})
