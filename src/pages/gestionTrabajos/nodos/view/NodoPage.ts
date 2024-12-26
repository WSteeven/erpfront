import { defineComponent, ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { NodoController } from 'gestionTrabajos/nodos/infraestructure/NodoController'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Nodo } from 'gestionTrabajos/nodos/domain/Nodo'
import useVuelidate from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { configuracionColumnasNodos } from 'gestionTrabajos/nodos/domain/configuracionColumnasNodos'
import ErrorComponent from 'components/ErrorComponent.vue'
import { ordenarLista } from 'shared/utils'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { EmpleadoRoleController } from 'recursosHumanos/empleados/infraestructure/EmpleadoRolesController'
import { rolesSistema } from 'config/utils'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    TabLayoutFilterTabs2
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Nodo, new NodoController())
    const {
      entidad: nodo,
      listadosAuxiliares,
      accion,
      disabled
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar, setValidador } =
      mixin.useComportamiento()
    const {} = mixin.useHooks()

    const tabDefecto = ref('1')
    const { empleados, filtrarEmpleados, grupos, filtrarGrupos } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoRoleController(),
          params: {
            roles: [
              rolesSistema.coordinador,
              rolesSistema.coordinadorBackup,
              rolesSistema.jefe_tecnico
            ]
          }
        },
        grupos: {
          controller: new GrupoController(),
          params: {
            activo: 1,
            'region[operator]': '!=',
            'region[value]': 'null'
          }
        }
      })

      empleados.value = listadosAuxiliares.empleados
      grupos.value = listadosAuxiliares.grupos
    })
    const reglas = {
      nombre: { required },
      coordinador: { required },
      grupos: { required }
    }
    const v$ = useVuelidate(reglas, nodo)
    setValidador(v$.value)

    /*******************
     * Funciones
     ******************/
    async function filtrarListados(tab: string) {
      tabDefecto.value = tab
      await listar({ activo: tab })
    }

    return {
      mixin,
      nodo,
      accion,
      disabled,
      v$,
      configuracionColumnas: configuracionColumnasNodos,
      tabDefecto,
      tabOptions: tabOptionsProveedoresInternacionales,

      // listados
      empleados,
      filtrarEmpleados,
      grupos,
      filtrarGrupos,

      //funciones
      filtrarListados,
      ordenarLista
    }
  }
})
