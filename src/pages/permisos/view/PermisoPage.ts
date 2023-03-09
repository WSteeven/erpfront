// Dependencias
import EssentialTable from 'components/tables/view/EssentialTable'
import { RolController } from 'pages/administracion/roles/infraestructure/RolController'
import { useQuasar } from 'quasar'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent,  ref } from 'vue'
import { configuracionColumnasPermisos } from '../domain/configuracionColumnasPermisos'
import { Permiso } from '../domain/Permiso'
import { PermisosController } from '../infrestructure/PermisosController'
// Logica y controladores


export default defineComponent({
  components: { EssentialTable },
  setup() {
     /*********
     * Stores
     *********/
     useNotificacionStore().setQuasar(useQuasar())
    const mixin = new ContenedorSimpleMixin(Permiso, new PermisosController())
    const {
      entidad: permiso,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()

    const { cargarVista,obtenerListados } = mixin.useComportamiento()
    const rol = ref(null);
    const roles = ref([]);
    cargarVista(async () => {
      await obtenerListados({
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' },
        },
      })});
      roles.value = listadosAuxiliares.roles
    return {
      mixin,
      permiso,
      configuracionColumnasPermisos,
      rol,
      listado,
      listadosAuxiliares,
      roles,
    }
  },
})
