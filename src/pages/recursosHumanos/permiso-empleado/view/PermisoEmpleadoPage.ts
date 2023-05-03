// Dependencias
import { configuracionColumnasPermisoEmpleado } from '../domain/configuracionColumnasPermisoEmpleado'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoEmpleadoController } from '../infraestructure/PermisoEmpleadoController'
import { PermisoEmpleado } from '../domain/PermisoEmpleado'
import { removeAccents } from 'shared/utils'
import { EstadoPermisoEmpleadoController } from 'pages/recursosHumanos/estado/infraestructure/EstadoPermisoEmpleadoController'
import { MotivoPermisoEmpleado } from 'pages/recursosHumanos/motivo/domain/MotivoPermisoEmpleado'
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(PermisoEmpleado, new PermisoEmpleadoController())
        const { entidad: cargo, disabled } = mixin.useReferencias()
        const { setValidador,cargarVista, obtenerListados } = mixin.useComportamiento()
        cargarVista(async () => {
          obtenerListados({
              motivos: new MotivoPermisoEmpleadoController(),
              estados: new EstadoPermisoEmpleadoController(),
          })
      })


        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, cargo)
        setValidador(v$.value)


        return {
            removeAccents,
            mixin,
            cargo,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasPermisoEmpleado,
        }
    }
})
