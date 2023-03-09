// Dependencias
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { RolController } from 'pages/administracion/roles/infraestructure/RolController'
import { useQuasar } from 'quasar'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, Ref, ref } from 'vue'
import { configuracionColumnasPermisos } from '../domain/configuracionColumnasPermisos'
import { Permiso } from '../domain/Permiso'
import { AsignarPermisosController } from '../infrestructure/AsignarPermisosController'
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

    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    const rol = ref()
    const roles = ref([])

    const controller = new PermisosController()
    const aisnarPermisoController = new AsignarPermisosController()
    const permisosSinAsignar: Ref<Permiso[]> = ref([])
    const refPermisosSinAsignar = ref()

    cargarVista(async () => {
      await obtenerListados({
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' },
        },
      })
    })

    roles.value = listadosAuxiliares.roles
    //listar()

    async function obtenerPermisoRol(id_rol: number) {
      listar({ id_rol: id_rol, tipo: 'ASIGNADOS' })
      const { result } = await controller.listar({
        id_rol: id_rol,
        tipo: 'NO ASIGNADOS',
      })
      permisosSinAsignar.value = result
    }
    function botonAsignarPermisos() {
      console.log('entro a boton Asignar')

      refPermisosSinAsignar.value.seleccionar()
    }
    function asignarPermiso(permisos: any) {
      const permisosName = permisos.map((permiso: Permiso) => permiso.name)

      aisnarPermisoController.guardar({
        id_rol: rol.value,
        permisos: permisosName,
      })
      obtenerPermisoRol(rol.value)
    }

    return {
      mixin,
      permiso,
      configuracionColumnasPermisos,
      rol,
      listado,
      permisosSinAsignar,
      obtenerPermisoRol,
      asignarPermiso,
      botonAsignarPermisos,
      listadosAuxiliares,
      roles,
      refPermisosSinAsignar,
    }
  },
})
