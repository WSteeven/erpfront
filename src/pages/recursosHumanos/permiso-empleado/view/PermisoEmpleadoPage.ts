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

export default defineComponent({
    components: { TabLayout,SelectorImagen },
    setup() {
        const mixin = new ContenedorSimpleMixin(PermisoEmpleado, new PermisoEmpleadoController())
        const { entidad: permiso, disabled,listadosAuxiliares } = mixin.useReferencias()
        const { setValidador,cargarVista, obtenerListados } = mixin.useComportamiento()
        const motivos = ref ([]);
        cargarVista(async () => {
          obtenerListados({
              motivos: new MotivoPermisoEmpleadoController(),
          })
      })
      motivos.value = listadosAuxiliares.motivos


        //Reglas de validacion
        const reglas = {
            motivo: { required },
            fecha_inicio: { required },
            fecha_fin: { required },
            justificacion: { required },
        }

        const v$ = useVuelidate(reglas, permiso)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            permiso,
            motivos,
            maskFecha,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasPermisoEmpleado,
        }
    }
})
