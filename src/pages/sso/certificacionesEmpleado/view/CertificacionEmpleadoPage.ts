// Dependencias
import { configuracionColumnasCertificacionEmpleado } from '../domain/configuracionColumnasCertificacionEmpleado'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CertificacionEmpleadoController } from '../infraestructure/CertificacionEmpleadoController'
import { CertificacionEmpleado } from '../domain/CertificacionEmpleado'
import { CertificacionController } from 'pages/sso/certificaciones/infraestructure/CertificacionController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      CertificacionEmpleado,
      new CertificacionEmpleadoController(),
    )
    const { entidad: certificacion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        certificaciones: {
          controller: new CertificacionController(),
          params: {
            activo: 1
          }
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        }
      })
    })

    const rules = {
      empleado: { required },
      certificaciones: { required },
    }

    const v$ = useVuelidate(rules, certificacion)
    setValidador(v$.value)

    /*************
     * Funciones
     *************/
    const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)

    /********
     * Init
     ********/
    useNotificacionStore().setQuasar(useQuasar())

    return {
      v$,
      mixin,
      certificacion,
      disabled,
      accion,
      configuracionColumnasCertificacionEmpleado,
      listadosAuxiliares,
      empleados,
      filtrarEmpleados,
    }
  },
})
