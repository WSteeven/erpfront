// Dependencias
import { configuracionColumnasPermisoEmpleado } from '../domain/configuracionColumnasPermisoEmpleado'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { PermisoEmpleado } from '../domain/PermisoEmpleado'
import { obtenerFechaActual, removeAccents, sumarFechas } from 'shared/utils'
import {
  acciones,
  autorizacionesId,
  convertir_fecha_hora,
  maskFecha,
  numDiaSemana,
  tabOptionsPermiso
} from 'config/utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ArchivoPermisoEmpleadoController } from '../infraestructure/ArchivoPermisoEmpleadoController'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { addDay, format, parse } from '@formkit/tempo'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { Autorizacion } from 'pages/administracion/autorizaciones/domain/Autorizacion'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    TabLayoutFilterTabs2,
    GestorDocumentos
  },
  setup() {
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
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, consultar, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const {
      onBeforeGuardar,
      onGuardado,
      onBeforeModificar,
      onConsultado,
      onReestablecer
    } = mixin.useHooks()
    const store = useAuthenticationStore()
    const { confirmar, notificarCorrecto } = useNotificaciones()
    const tipos_permisos = ref([])
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const aux_fecha_inicio = ref()
    const aux_fecha_fin = ref()
    const refArchivoPrestamoEmpresarial = ref()
    const autorizaciones = ref()
    const esRecursosHumanos = store.esRecursosHumanos
    const esAutorizador = ref(false)
    //Definimos variables de hora de inicio y fin para la jornada laboral
    const horaInicioLaboral = 8
    const horaFinLaboral = 17
    const milisegundosPorHora = 1000 * 60 * 60 //1000 es 1 segundo; 1000 milisegundos*60 es 1 minuto; 1000*60*60 es 1 hora
    const minuteOptions = [0, 15, 30, 45]
    const mask = 'YYYY-MM-DD HH:mm'

    const verEmpleado = computed(() => store.can('puede.ver.campo.empleado'))
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })

    const dias_permiso = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = parse(permiso.fecha_hora_inicio, mask)
        const fechaFin = parse(permiso.fecha_hora_fin, mask)
        let horasLaborales = 0
        const fechaActual = fechaInicio
        let diferenciaDias: number

        while (fechaActual < fechaFin) {
          if (
            fechaActual.getHours() >= horaInicioLaboral &&
            fechaActual.getHours() < horaFinLaboral
          )
            horasLaborales++

          //Avanzamos a la siguiente hora
          fechaActual.setTime(fechaActual.getTime() + milisegundosPorHora)
        }
        // console.log(horasLaborales)
        if (horasLaborales > 8) {
          // console.log(horasLaborales / 9 * 8)
          diferenciaDias = horasLaborales / 9
        } else diferenciaDias = horasLaborales < 8 ? 0 : horasLaborales / 8

        return Math.round(diferenciaDias)
      } else {
        return 0
      }
    })
    const horas_permisos = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = parse(permiso.fecha_hora_inicio, mask)
        const fechaFin = parse(permiso.fecha_hora_fin, mask)
        // Verificar que la fecha de inicio sea anterior a la fecha de fin
        if (fechaInicio >= fechaFin) {
          return 'La fecha de inicio debe ser anterior a la fecha de fin.'
        }
        let tiempoLaboralMilisegundos = 0
        const fechaActual = new Date(fechaInicio)

        // Iterar sobre cada día entre la fecha de inicio y la fecha de fin
        while (fechaActual < fechaFin) {
          // Si la fecha actual es antes del horario laboral, avanzar al próximo día laboral
          if (
            fechaActual.getHours() < horaInicioLaboral ||
            (fechaActual.getHours() === horaInicioLaboral &&
              fechaActual.getMinutes() < 0)
          ) {
            fechaActual.setHours(horaInicioLaboral)
            fechaActual.setMinutes(0)
          }

          // Si la fecha actual es después del horario laboral, avanzar al próximo día laboral
          if (
            fechaActual.getHours() >= horaFinLaboral ||
            (fechaActual.getHours() === horaFinLaboral &&
              fechaActual.getMinutes() >= 0)
          ) {
            fechaActual.setDate(fechaActual.getDate() + 1)
            fechaActual.setHours(horaInicioLaboral)
            fechaActual.setMinutes(0)
            continue
          }

          // Calcular la fecha de fin del día laboral actual
          let finDiaLaboral = new Date(fechaActual)
          finDiaLaboral.setHours(horaFinLaboral)
          finDiaLaboral.setMinutes(0)

          // Si la fecha de fin es después de la fecha de fin real, ajustarla
          if (finDiaLaboral > fechaFin) {
            finDiaLaboral = new Date(fechaFin)
          }

          // Calcular la diferencia en milisegundos para este día laboral
          const diferenciaMilisegundos =
            finDiaLaboral.getTime() - fechaActual.getTime()
          tiempoLaboralMilisegundos += diferenciaMilisegundos

          // Avanzar al próximo día laboral
          fechaActual.setDate(fechaActual.getDate() + 1)
          fechaActual.setHours(horaInicioLaboral)
          fechaActual.setMinutes(0)
        }

        // Convertir el tiempo laboral total en horas y minutos
        const horas =
          Math.floor(tiempoLaboralMilisegundos / milisegundosPorHora) > 8
            ? Math.floor(
                (tiempoLaboralMilisegundos / milisegundosPorHora / 9) * 8
              )
            : Math.floor(tiempoLaboralMilisegundos / milisegundosPorHora)
        const minutos = Math.floor(
          (tiempoLaboralMilisegundos % milisegundosPorHora) / (1000 * 60)
        )

        // Formatear el resultado como "horas minutos"
        return `${horas} horas ${minutos} minutos`
      } else {
        return 0
      }
    })

    watchEffect(() => {
      permiso.cargo_vacaciones = dias_permiso.value == 1
    })

    onBeforeGuardar(() => {
      permiso.tieneDocumento =
        refArchivoPrestamoEmpresarial.value.tamanioListado > 0
      // if (!permiso.tieneDocumento) {
      //   notificarAdvertencia('Debe seleccionar al menos un archivo.')
      // }
    })
    onBeforeModificar(() => {
      permiso.tieneDocumento = true
    })
    onGuardado((id: number) => {
      subirArchivos(id)
    })

    async function subirArchivos(id: number) {
      await refArchivoPrestamoEmpresarial.value.subir({ permiso_id: id })
    }

    onConsultado(() => {
      esAutorizador.value = store.user.id == permiso.id_jefe_inmediato
      aux_fecha_inicio.value =
        permiso.fecha_hora_inicio == null ? '' : permiso.fecha_hora_inicio
      aux_fecha_fin.value =
        permiso.fecha_hora_fin == null ? '' : permiso.fecha_hora_fin
      setTimeout(() => {
        refArchivoPrestamoEmpresarial.value.listarArchivos({
          permiso_id: permiso.id
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
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        autorizaciones: {
          controller: new AutorizacionController(),
          params: {
            campos: 'id,nombre',
            es_validado: false,
            es_modulo_rhh: true
          }
        }
      })

      empleados.value = listadosAuxiliares.empleados
      tipos_permisos.value = listadosAuxiliares.tipos_permisos
      autorizaciones.value = listadosAuxiliares.autorizaciones.filter(
        (v: Autorizacion) => v.id !== autorizacionesId.VALIDADO
      )
    })

    function optionsFechaInicio(date: string) {
      const currentDateString = sumarFechas(
        obtenerFechaActual(),
        0,
        0,
        -15,
        'YYYY/MM/DD'
      )
      return (
        date >= currentDateString &&
        new Date(date).getDay() < numDiaSemana.sabado &&
        new Date(date).getDay() > numDiaSemana.domingo
      )
    }

    function optionsFecha(date: string) {
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
    function optionsFechaRecuperacion(date: string) {
      const fecha_hora_fin = permiso.suguiere_fecha
        ? new Date(permiso.fecha_hora_reagendamiento || Date.now())
        : new Date(
            permiso.fecha_hora_fin
              ? convertir_fecha_hora(permiso.fecha_hora_fin)
              : Date.now()
          )
      return (
        date >
          format(
            addDay(
              fecha_hora_fin,
              dias_permiso.value > 0 ? dias_permiso.value - 1 : 0
            ),
            'YYYY/MM/DD'
          ) &&
        new Date(date).getDay() < numDiaSemana.sabado &&
        new Date(date).getDay() > numDiaSemana.domingo
      )
    }

    function optionsFechaSugerida(date: string) {
      const partes = permiso.fecha_hora_fin?.split(' ')
      return date > format(partes[0], 'YYYY/MM/DD')
    }

    //Reglas de validacion
    const reglas = {
      tipo_permiso: { required },
      fecha_hora_inicio: { required },
      fecha_hora_fin: { required },
      fecha_recuperacion: {
        required: requiredIf(() => permiso.recupero == true)
      },
      hora_recuperacion: {
        required: requiredIf(() => permiso.recupero == true)
      },
      justificacion: { required },
      observacion: { required: requiredIf(() => esAutorizador.value) }
    }

    const v$ = useVuelidate(reglas, permiso)
    setValidador(v$.value)
    const tabPermisoEmpleado = ref('1')

    function filtrarPermisoEmpleado(tabSeleccionado: string) {
      switch (tabSeleccionado) {
        case '1': // pendientes
          listar({ estado_permiso_id: tabSeleccionado })
          break
        case '2': //aprobados
          listar({ estado_permiso_id: tabSeleccionado, recupero: 0 })
          break
        case '3': //cancelados o anulados
          listar({ estado_permiso_id: tabSeleccionado, recupero: 0 })
          break
        default: // recuperados
          listar({ recupero: 1 })
      }
      tabPermisoEmpleado.value = tabSeleccionado
    }

    const editarPermiso: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: () => store.can('puede.editar.permiso_nomina'),
      accion: ({ entidad }) => {
        accion.value = acciones.editar
        consultar(entidad)
      }
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

    const checkCargoDescuento = (val: boolean) => {
      if (val) {
        confirmar(
          'Se sumarán las horas para un descuento en rol de pagos. ¿Está seguro de continuar?',
          () => {
            notificarCorrecto(
              'Configuración realizada, ¡por favor guarda los cambios!'
            )
          },
          () => {
            permiso.cargo_descuento = false
          }
        )
      }
    }

    return {
      removeAccents,
      mixin,
      permiso,
      optionsFecha,
      minuteOptions,
      filtrarEmpleados,
      filtrarPermisoEmpleado,
      optionsFechaInicio,
      optionsFechaRecuperacion,
      optionsFechaSugerida,
      cambiar_fecha,
      checkCargoDescuento,
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
      acciones,
      maskFecha,
      store,
      v$,
      disabled,
      tabOptionsPermiso,
      configuracionColumnas: configuracionColumnasPermisoEmpleado,
      mask
    }
  }
})
