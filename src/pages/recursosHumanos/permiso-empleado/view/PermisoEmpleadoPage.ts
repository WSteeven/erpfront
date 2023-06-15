// Dependencias
import { configuracionColumnasPermisoEmpleado } from '../domain/configuracionColumnasPermisoEmpleado'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { PermisoEmpleado } from '../domain/PermisoEmpleado'
import { removeAccents } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { EstadoPermisoEmpleadoController } from 'pages/recursosHumanos/estado/infraestructure/EstadoPermisoEmpleadoController'
import { MotivoPermisoEmpleado } from 'pages/recursosHumanos/motivo/domain/MotivoPermisoEmpleado'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      PermisoEmpleado,
      new PermisoEmpleadoController()
    )
    const {
      entidad: permiso,
      disabled,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const tipos_permisos = ref([])
    const empleados = ref([])
    const dias_permiso = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = convertir_fecha(permiso.fecha_hora_inicio)
        const fechaFin =  convertir_fecha(permiso.fecha_hora_fin)
        // Calcula la diferencia en dias
        const diferenciaDias = fechaFin.getDate() - fechaInicio.getDate()
        return diferenciaDias
      }else{
        return 0
      }

    })
    const horas_permisos = computed(() => {
      if (permiso.fecha_hora_inicio != null && permiso.fecha_hora_fin != null) {
        const fechaInicio = convertir_fecha(permiso.fecha_hora_inicio)
        const fechaFin =  convertir_fecha(permiso.fecha_hora_fin)
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
      const today = new Date();
      const fechaActual = convertir_fecha(permiso.fecha_hora_inicio);
      const fechaIngresada = new Date(date);
      const diferenciaDias = fechaIngresada.getDate() - fechaActual.getDate()
      return diferenciaDias == 0;
    }
    function convertir_fecha(fecha){
      const dateParts = fecha.split('-') // Dividir el string en partes usando el guión como separador
    let tiempo = dateParts[2]
    tiempo = tiempo.split(' ')
    tiempo = tiempo[1].split(':')
    const dia = parseInt(dateParts[0], 10) // Obtener el día como entero
    const mes = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
    const anio = parseInt(dateParts[2], 10)
    const fecha_convert = new Date(
      anio,
      mes,
      dia,
      tiempo[0],
      tiempo[1],
      0
    )
    return fecha_convert;
    }
    cargarVista(async () => {
      obtenerListados({
        tipos_permisos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
      tipos_permisos.value = listadosAuxiliares.tipos_permisos
    })

    //Reglas de validacion
    const reglas = {
      empleado: { required },
      tipo_permiso: { required },
      fecha_hora_inicio: { required },
      fecha_hora_fin: { required },
      fecha_recuperacion: { required },
      hora_recuperacion: { required },
      justificacion: { required },
      documento: { required },
    }

    const v$ = useVuelidate(reglas, permiso)
    setValidador(v$.value)

    return {
      removeAccents,
      mixin,
      permiso,
      optionsFecha,
      tipos_permisos,
      dias_permiso,
      horas_permisos,
      empleados,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPermisoEmpleado,
    }
  },
})
