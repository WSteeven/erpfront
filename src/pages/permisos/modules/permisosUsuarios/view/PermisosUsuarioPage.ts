// Dependencias
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { useQuasar } from 'quasar'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, Ref, ref } from 'vue'
import { configuracionColumnasPermisos } from 'pages/permisos/domain/configuracionColumnasPermisos'
import { Permiso } from 'pages/permisos/domain/Permiso'
import { PermisosController } from 'pages/permisos/infrestructure/PermisosController'
// Logica y controladores
import { ComportamientoModalesPermisoNuevo } from './../../../application/ComportamientoModalesPermisoNuevo'
import { useRouter } from 'vue-router'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { PermisosUsuarioController } from '../infraestructure/PermisosUsuarioController'
import { AsignarPermisosIndividualController } from '../infraestructure/AsignarPermisosIndividualController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'


export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const mixin = new ContenedorSimpleMixin(Permiso, new PermisosUsuarioController())
    const {
      entidad: permiso,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()
    const Router = useRouter()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    // const roles = ref()
    const permisos = ref()
    const empleado = ref()
    const { empleados, filtrarEmpleados, roles } = useFiltrosListadosSelects(listadosAuxiliares)

    const controller = new PermisosController()
    const asignarPermisoController = new AsignarPermisosIndividualController()
    const essentialLoading = new StatusEssentialLoading()
    const permisosSinAsignar: Ref<Permiso[]> = ref([])
    const permisosAsignados: Ref<Permiso[]> = ref([])
    const refPermisosSinAsignar = ref()
    const refPermisosAsignados = ref()

    cargarVista(async () => {
      await obtenerListados({
        // empleados: new EmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos,identificacion', estado: 1 }
        }
      })
    })
    empleados.value = listadosAuxiliares.empleados
    async function obtenerPermisoRol(id_rol: number) {
      await listar({ id_rol: id_rol, tipo: 'ASIGNADOS' })
      const { result } = await controller.listar({
        id_rol: id_rol,
        tipo: 'NO ASIGNADOS',
      })
      permisosSinAsignar.value = result
    }
    function botonAsignarPermisos() {
      refPermisosSinAsignar.value.seleccionar()
      refPermisosSinAsignar.value.clearSelection()
    }
    function botonEliminarPermisos() {
      refPermisosAsignados.value.seleccionar()
      refPermisosAsignados.value.clearSelection()
    }
    function asignarPermiso(permisos: any) {
      const permisosIds = permisos.map((permiso: Permiso) => permiso.id)
      asignarPermisoController.guardar({
        empleado_id: empleado.value,
        permisos: permisosIds,
        tipo_sincronizacion: 'ASIGNAR',
      })
      filtrarRolesEmpleados()
    }
    function eliminarPermiso(permisos: any) {
      const permisosIds = permisos.map((permiso: Permiso) => permiso.id)
      asignarPermisoController.guardar({
        empleado_id: empleado.value,
        permisos: permisosIds,
        tipo_sincronizacion: 'ELIMINAR',
      })
      filtrarRolesEmpleados()
    }
    /**Modales */
    const modales = new ComportamientoModalesPermisoNuevo()
    function crear_permiso() {
      modales.abrirModalEntidad('PermisoNuevoPage')
    }
    const crearRol = () => {
      Router.replace('/roles')
    }

    async function filtrarRolesEmpleados() {
      essentialLoading.activar()
      const { result } = await new EmpleadoController().consultar(empleado.value);
      roles.value = result.roles
      permisos.value = [...result.permisos]
      //Buscar los permisos no asignados a un empleado
      const { response } = await new PermisosUsuarioController().listar({
        empleado_id: empleado.value,
        tipo: 'NO ASIGNADOS'
      })


      permisosSinAsignar.value = response.data.results
      listado.value = [...response.data.permisos_usuario]
      essentialLoading.desactivar()
    }

    return {
      fecha: ref(),
      mixin,
      permiso,
      modales,
      configuracionColumnasPermisos,
      empleado,
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
      roles, permisos, empleados, permisosAsignados,
      refPermisosSinAsignar,
      refPermisosAsignados,
      filtrarEmpleados,
      filtrarRolesEmpleados,

    }
  },
})
