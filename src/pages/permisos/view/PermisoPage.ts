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
import { useRouter } from 'vue-router'

// Logica y controladores

export default defineComponent({
  components: { EssentialTable, ModalEntidad },
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
    const Router = useRouter()
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
    async function obtenerPermisoRol(val) {
      if (val) {
        listar({ id_rol: val, tipo: 'ASIGNADOS' })
        permisosSinAsignar.value = (await controller.listar({ id_rol: val, tipo: 'NO ASIGNADOS', })).result
      }
    }
    async function botonAsignarPermisos() {
      await refPermisosSinAsignar.value.seleccionar()
      await refPermisosSinAsignar.value.clearSelection()
    }
    async function botonEliminarPermisos() {
      await refPermisosAsignados.value.seleccionar()
      await refPermisosAsignados.value.clearSelection()
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
    function eliminarPermiso(permisos: any) {
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
    const crearRol = () => {
      Router.replace('/roles')
    }

    return {
      mixin,
      permiso,
      modales,
      configuracionColumnasPermisos,
      rol,
      listado,
      permisosSinAsignar,
      crearRol,
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
      filtrarRol(val, update) {
        if (val === '') {
          update(() => {
            roles.value = listadosAuxiliares.roles
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          roles.value = listadosAuxiliares.roles.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },

    }
  },
})
