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
import { ComportamientoModalesPermisoNuevo } from '../application/ComportamientoModalesPermisoNuevo'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
// Logica y controladores

export default defineComponent({
  components: { EssentialTable,ModalEntidad },
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
    const refPermisosAsignados = ref()

    cargarVista(async () => {
      await obtenerListados({
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' },
        },
      })
    })
    roles.value = listadosAuxiliares.roles
    async function obtenerPermisoRol(id_rol: number) {
      listar({ id_rol: id_rol, tipo: 'ASIGNADOS' })
      const { result } = await controller.listar({
        id_rol: id_rol,
        tipo: 'NO ASIGNADOS',
      })
      permisosSinAsignar.value = result
    }
    function botonAsignarPermisos() {
      refPermisosSinAsignar.value.seleccionar()
    }
    function botonEliminarPermisos() {
     refPermisosAsignados.value.seleccionar()
    }
    function asignarPermiso(permisos: any) {
      const permisosName = permisos.map((permiso: Permiso) => permiso.id)
      aisnarPermisoController.guardar({
        id_rol: rol.value,
        permisos: permisosName,
        tipo_sincronizacion: 'ASIGNAR',
      })
      obtenerPermisoRol(rol.value)
    }
    function eliminarPermiso(permisos: any){
     const permisosName = permisos.map((permiso: Permiso) => permiso.id)
      aisnarPermisoController.guardar({
        id_rol: rol.value,
        permisos: permisosName,
        tipo_sincronizacion: 'ELIMINAR',
      })
      obtenerPermisoRol(rol.value)
    }
     /**Modales */
     const modales = new ComportamientoModalesPermisoNuevo()
     function crear_permiso() {
       modales.abrirModalEntidad('PermisoNuevoPage')
     }

    return {
      mixin,
      permiso,
      modales,
      configuracionColumnasPermisos,
      rol,
      listado,
      permisosSinAsignar,
      crear_permiso,
      obtenerPermisoRol,
      asignarPermiso,
      eliminarPermiso,
      botonAsignarPermisos,
      botonEliminarPermisos,
      listadosAuxiliares,
      roles,
      refPermisosSinAsignar,
      refPermisosAsignados,
    }
  },
})
