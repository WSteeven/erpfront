// Dependencias
import { configuracionColumnasPermisoEmpleado } from '../domain/configuracionColumnasPermisoEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import ArchivoSeguimiento from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { PermisoEmpleado } from '../domain/PermisoEmpleado'
import { removeAccents } from 'shared/utils'
import {
  autorizacionesId,
  convertir_fecha_guion,
  convertir_fecha_hora,
  maskFecha,
  numDiaSemana,
  tabOptionsPermiso,
} from 'config/utils'
import { requiredIf, required } from 'shared/i18n-validators'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ArchivoPermisoEmpleadoController } from '../infraestructure/ArchivoPermisoEmpleadoController'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { addDay, format, parse } from '@formkit/tempo'

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
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, consultar, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const {
      onBeforeGuardar,
      onGuardado,
      onBeforeModificar,
      onConsultado,
      onReestablecer,
    } = mixin.useHooks()
    const store = useAuthenticationStore()
    const { notificarAdvertencia } = useNotificaciones()

    const tipos_permisos = ref([])
    const empleados = ref([])
    const aux_fecha_inicio = ref()
    const aux_fecha_fin = ref()
    const refArchivoPrestamoEmpresarial = ref()
    const autorizaciones = ref()
    const esRecursosHumanos = store.esRecursosHumanos
    const esAutorizador = ref(false)
    //Definimos variables de hora de inicio y fin para la jornada laboral
    const horaInicioLaboral = 8
    const horaFinLaboral = 17
    const milisegundosPorHora = 1000 * 60 * 60;
    const minuteOptions = [0, 15, 30, 45]


    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const dias_permiso = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = parse(permiso.fecha_hora_inicio != null ? permiso.fecha_hora_inicio : new Date().toString(), 'DD-MM-YYYY HH:mm:ss')
        const fechaFin = parse(permiso.fecha_hora_fin != null ? permiso.fecha_hora_fin : new Date().toString(), 'DD-MM-YYYY HH:mm:ss')
        let horasLaborales = 0
        let fechaActual = fechaInicio
        let diferenciaDias = 0

        while (fechaActual < fechaFin) {
          if (fechaActual.getHours() >= horaInicioLaboral && fechaActual.getHours() < horaFinLaboral)
            horasLaborales++

          //Avanzamos a la siguiente hora
          fechaActual.setTime(fechaActual.getTime() + milisegundosPorHora);
        }
        console.log(horasLaborales)
        if (horasLaborales > 8) {
          console.log(horasLaborales / 9 * 8)
          diferenciaDias = horasLaborales / 9
        } else
          diferenciaDias = horasLaborales < 8 ? 0 : horasLaborales / 8

        return Math.round(diferenciaDias)
      } else {
        return 0
      }
    })
    const horas_permisos = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = parse(permiso.fecha_hora_inicio != null ? permiso.fecha_hora_inicio : new Date().toString(), 'DD-MM-YYYY HH:mm:ss')
        const fechaFin = parse(permiso.fecha_hora_fin != null ? permiso.fecha_hora_fin : new Date().toString(), 'DD-MM-YYYY HH:mm:ss')
        // Verificar que la fecha de inicio sea anterior a la fecha de fin
        if (fechaInicio >= fechaFin) {
          return "La fecha de inicio debe ser anterior a la fecha de fin.";
        }

        // Si la fecha de inicio es después del horario de cierre, no hay horas laborales ese día
        if (fechaInicio.getHours() >= horaFinLaboral || (fechaInicio.getHours() === horaFinLaboral && fechaInicio.getMinutes() >= 0)) {
          return "0 horas laborales entre las fechas especificadas.";
        }

        // Si la fecha de fin es antes del horario de apertura, no hay horas laborales ese día
        if (fechaFin.getHours() < horaInicioLaboral || (fechaFin.getHours() === horaInicioLaboral && fechaFin.getMinutes() <= 0)) {
          return "0 horas laborales entre las fechas especificadas.";
        }

        // Ajustar la fecha de inicio y fin al horario laboral
        if (fechaInicio.getHours() < horaInicioLaboral || (fechaInicio.getHours() === horaInicioLaboral && fechaInicio.getMinutes() < 0)) {
          fechaInicio.setHours(horaInicioLaboral);
          fechaInicio.setMinutes(0);
        }

        if (fechaFin.getHours() > horaFinLaboral || (fechaFin.getHours() === horaFinLaboral && fechaFin.getMinutes() > 0)) {
          fechaFin.setHours(horaFinLaboral);
          fechaFin.setMinutes(0);
        }

        // Calcular la diferencia en milisegundos
        let diferenciaMilisegundos = fechaFin.getTime() - fechaInicio.getTime();

        // Convertir la diferencia de milisegundos a horas y minutos
        let horas = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60));
        let minutos = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60));

        // Formatear el resultado como "horas minutos"
        return `${horas} horas ${minutos} minutos`;
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
          params: {
            campos: 'id,nombre',
            es_validado: false,
            es_modulo_rhh: true,
          },
        },
      })

      empleados.value = listadosAuxiliares.empleados
      tipos_permisos.value = listadosAuxiliares.tipos_permisos
      autorizaciones.value = listadosAuxiliares.autorizaciones.filter(
        (v) => v.id !== autorizacionesId.VALIDADO
      )
    })
    function optionsFechaInicio(date) {
      const currentDateString = format(new Date(), 'YYYY/MM/DD')
      return (
        date >= currentDateString &&
        new Date(date).getDay() < numDiaSemana.sabado &&
        new Date(date).getDay() > numDiaSemana.domingo
      )
    }
    function optionsFecha(date) {
      const fecha_hora_inicio = format(
        new Date(convertir_fecha_hora(permiso.fecha_hora_inicio)),
        'YYYY/MM/DD'
      )
      return (
        date >= fecha_hora_inicio &&
        new Date(date).getDay() < numDiaSemana.sabado &&
        new Date(date).getDay() > numDiaSemana.domingo
      )
    }

    /**
     * La función `opcionesFechaRecuperacion` verifica si una fecha determinada está dentro de ciertas
     * restricciones en función de los parámetros de entrada.
     * @param date - La función `opcionesFechaRecuperacion` toma un parámetro `fecha` y verifica si
     * se suguiere fecha obtine la fecha sugerida caso contrario obtine la fecha de finalizacion. La función parece estar verificando si la 'fecha' proporcionada cumple con
     * ciertas condiciones basadas en los valores de las variables 'permiso', 'dias_permiso' y
     * 'numDiaSemana'.
     * @returns La función `opcionesFechaRecuperacion` devuelve un valor booleano basado en las condiciones
     * proporcionadas. La declaración de retorno verifica si la entrada `fecha` es mayor que una fecha
     * formateada calculada en base a ciertas condiciones que involucran las variables `fecha_hora_fin`,
     * `dias_permiso.value` y `numDiaSemana`. Si se cumplen todas las condiciones, la función devuelve
     * 'verdadero', de lo contrario devuelve falso
     */
    function optionsFechaRecuperacion(date) {
      const fecha_hora_fin = permiso.suguiere_fecha
        ? new Date(permiso.fecha_hora_reagendamiento || Date.now())
        : new Date(permiso.fecha_hora_fin ? convertir_fecha_hora(permiso.fecha_hora_fin) : Date.now());
      return (
        date > format(addDay(fecha_hora_fin, (dias_permiso.value > 0 ? dias_permiso.value - 1 : 0)), 'YYYY/MM/DD') &&
        new Date(date).getDay() < numDiaSemana.sabado &&
        new Date(date).getDay() > numDiaSemana.domingo
      )
    }
    function optionsFechaSugerida(date) {
      const fechaFin = convertir_fecha_guion(
        permiso.fecha_hora_fin !== null ? permiso.fecha_hora_fin : ' '
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
      optionsFecha, minuteOptions,
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
