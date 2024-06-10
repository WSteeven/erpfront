// Dependencias
import { configuracionColumnasGrupo } from '../domain/configuracionColumnasGrupo'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
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
import { ordernarListaString } from 'shared/utils'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { configuracionColumnasEmpleadosLite } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Grupo,
      new GrupoController()
    )
    const { entidad: grupo, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
      })

      empleados.value = listadosAuxiliares.grupos
    })

    const empleados = ref([])

    function filtrarEmpleados(val, update) {
      if (val === '') update(() => empleados.value = listadosAuxiliares.empleados.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
      })
    }

    const rules = {
      nombre: { required },
      coordinador: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, grupo)
    setValidador(v$.value)

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

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
      ordenarEmpleados,
    }
  },
})
