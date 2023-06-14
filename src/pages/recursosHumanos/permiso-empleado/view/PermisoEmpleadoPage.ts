// Dependencias
import { configuracionColumnasPermisoEmpleado } from '../domain/configuracionColumnasPermisoEmpleado'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

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
    components: { TabLayout,SelectorImagen },
    setup() {
        const mixin = new ContenedorSimpleMixin(PermisoEmpleado, new PermisoEmpleadoController())
        const { entidad: permiso, disabled,listadosAuxiliares } = mixin.useReferencias()
        const { setValidador,cargarVista, obtenerListados } = mixin.useComportamiento()
        const tipos_permisos = ref ([]);
        const empleados = ref([])
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
            fecha_recuperacion:  { required },
            hora_recuperacion:  { required },
            justificacion: { required },
            documento: { required },
        }

        const v$ = useVuelidate(reglas, permiso)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            permiso,
            tipos_permisos,
            empleados,
            maskFecha,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasPermisoEmpleado,
        }
    }
})
