// Dependencias
import { configuracionColumnasGrupo } from '../domain/configuracionColumnasGrupo'
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
import { GrupoController } from '../infraestructure/GrupoController'
import { Grupo } from '../domain/Grupo'
import { regiones } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ordenarLista } from 'shared/utils'
import { configuracionColumnasEmpleadosLite } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    TabLayout,
    EssentialTable
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Grupo, new GrupoController())
    const {
      entidad: grupo,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()

    const {empleados, filtrarEmpleados} = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        }
      })

      empleados.value = listadosAuxiliares.grupos
    })

    
    const rules = {
      nombre: { required },
      coordinador: { required }
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, grupo)
    setValidador(v$.value)

    

    return {
      // mixin
      configuracionColumnasEmpleadosLite,
      v$,
      mixin,
      grupo,
      disabled,
      accion,
      configuracionColumnasGrupo,
      regiones,
      filtrarEmpleados,
      empleados,
      ordenarLista,
    }
  }
})
