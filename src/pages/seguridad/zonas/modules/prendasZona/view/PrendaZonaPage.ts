// Dependencias
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/pedidos/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasEmpleadosLite } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite'
import { configuracionColumnasEmpleadoDesignado } from 'pages/seguridad/zonas/domain/configuracionColumnasEmpleadoDesignado'
import { configuracionColumnasDetallesModal } from 'pages/bodega/pedidos/domain/configuracionColumnasDetallesModal'
import { configuracionColumnasRestriccionPrendaZona } from '../domain/configuracionColumnasRestriccionPrendaZona'
import { configuracionColumnasPrendaZona } from '../domain/configuracionColumnasPrendaZona'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { ordenarLista } from 'shared/utils'
import useVuelidate from '@vuelidate/core'
import { acciones } from 'config/utils'
import { iconos } from 'config/iconos'
import { endpoints } from 'config/api'
import { useQuasar } from 'quasar'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { useOrquestadorSelectorEmpleados } from 'pages/seguridad/bitacoras/application/useOrquestadorSelectorEmpleados'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useMaterialesEmpleado } from 'pages/gestionTrabajos/miBodega/application/UseMaterialesEmpleado'
import { FiltroMiBodegaEmpleado } from 'pages/gestionTrabajos/miBodega/domain/FiltroMiBodegaEmpleado'
import { RestriccionPrendaZonaController } from '../infraestructure/RestriccionPrendaZonaController'
import { MiembroZonaController } from 'pages/seguridad/zonas/infraestructure/MiembroZonaController'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { ZonaController } from 'pages/seguridad/zonas/infraestructure/ZonaController'
import { PrendaZonaController } from '../infraestructure/PrendaZonaController'
import { RestriccionPrendaZona } from '../domain/RestriccionPrendaZona'
import { MiembroZona } from 'pages/seguridad/zonas/domain/MiembroZona'
import { PrendaZona } from '../domain/PrendaZona'

export default defineComponent({
  components: { TabLayout, EssentialTable, EssentialSelectableTable },
  setup() {
    /**********
     * Stores
     **********/
    useNotificacionStore().setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(PrendaZona, new PrendaZonaController())
    const { entidad: prendaZona, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onReestablecer, onConsultado } = mixin.useHooks()

    const mixinRestriccionPrendaZona = new ContenedorSimpleMixin(RestriccionPrendaZona, new RestriccionPrendaZonaController())
    const { listado: prendasAsignadas } = mixinRestriccionPrendaZona.useReferencias()
    const { listar: listarRestriccionPrendaZona, guardarListado: guardarListadoRestriccionesPrendasZona, eliminarListado: eliminarListadoRestriccionesPrendasZona } = mixinRestriccionPrendaZona.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        zonas: {
          controller: new ZonaController(),
          params: { activo: 1 },
        },
        clientesMaterialesEmpleado: [],
        miembrosZona: [],
      })
    })

    /*************
     * Variables
     *************/
    const { confirmar, notificarAdvertencia } = useNotificaciones()
    const refPrendasAsignadas = ref()
    const refPrendasSinAsignar = ref()
    const errorExisteZona = ref()
    const prendasSinAsignar = computed(() => {
      return prendaZona.detalles_productos.filter((dp: DetalleProducto) => {
        return !prendasAsignadas.value.some((rAsignado: RestriccionPrendaZona) => rAsignado.detalle_producto_id === dp.id && rAsignado.miembro_zona_id === prendaZona.miembro_zona)
      }).map((d: DetalleProducto, index: number) => { return { id: index, detalle_producto_id: d.id, detalle_producto: d.descripcion, miembro_zona_id: prendaZona.miembro_zona } })
    })

    /****************
     * Botones tabla
     ****************/
    const eliminarDetalleProductoSeleccionado = ({ posicion }) => confirmar('Esta operación es irreversible. ¿Desea continuar?', async () => {
      const detalleProductoEliminado = prendaZona.detalles_productos.splice(posicion, 1)[0]

      const restriccionesAEliminar = listadosAuxiliares.miembrosZona.filter((m: MiembroZona) => !!m.tiene_restriccion).map((mz: MiembroZona) => {
        return { miembro_zona_id: mz.id, detalle_producto_id: detalleProductoEliminado.id }
      })
      console.log(restriccionesAEliminar)
      if (restriccionesAEliminar.length) await eliminarRestriccionesPorDetalleProductoMiembroZona(restriccionesAEliminar)
      else {
        const index = prendasAsignadas.value.findIndex((restriccion: RestriccionPrendaZona) => restriccion.detalle_producto_id === detalleProductoEliminado.id)
        prendasAsignadas.value.splice(index, 1)
      }
    })

    /*************
     * Funciones
     *************/
    const { zonas, filtrarZonas } = useFiltrosListadosSelects(listadosAuxiliares)
    const filtroEmpleado = reactive(new FiltroMiBodegaEmpleado())
    const { consultarClientesMaterialesEmpleado } = useMaterialesEmpleado(filtroEmpleado, listadosAuxiliares)

    const seleccionarCliente = () => {
      filtroEmpleado.empleado_id = prendaZona.empleado_id
      filtroEmpleado.cliente_id = prendaZona.cliente_id
    }

    const recargarListados = async () => {//nombreListado: string) => {
      cargarVista(async () => {
        await obtenerListados({
          zonas: {
            controller: new ZonaController(),
            params: { activo: 1 },
          },
        })
      })
    }

    const consultarMiembrosZona = (zona: number) => {
      existeZona(zona)
      cargarVista(async () => {
        await obtenerListados({
          miembrosZona: {
            controller: new MiembroZonaController(),
            params: { 'zona_id': zona },
          },
        })
      })
    }

    const eliminarRestriccionesPorDetalleProductoMiembroZona = async (data) => {
      const axios = AxiosHttpRepository.getInstance()
      await axios.delete(axios.getEndpoint(endpoints.restricciones_prendas_zonas_datos), { data })
    }

    const existeZona = async (zona: number) => {
      console.log(zona)
      if (!zona) return errorExisteZona.value = null // Si está vacío, no validar
      if (accion.value === acciones.editar) return errorExisteZona.value = null

      try {
        const axios = AxiosHttpRepository.getInstance()
        await axios.get(axios.getEndpoint(endpoints.prendas_zonas_existe) + '?zona_id=' + zona)
        errorExisteZona.value = 'Esta zona ya está registrada, en su lugar edite este registro'
      } catch (error) {
        errorExisteZona.value = null
        // return true; // ✅ Si no existe, es válido
      }
      prendaZona.tiene_restricciones = false
    }

    const obtenerPrendasAsignadas = async (miembroZona: number) => {
      await listarRestriccionPrendaZona({ miembro_zona_id: miembroZona })
      if (!prendasAsignadas.value.length) prendasAsignadas.value = prendaZona.detalles_productos.map((d: DetalleProducto, index: number) => { return { id: index, detalle_producto_id: d.id, detalle_producto: d.descripcion, miembro_zona_id: miembroZona } })
    }

    const asignarPrenda = async (restriccionesPrendasZona: RestriccionPrendaZona[]) => {
      await guardarListadoRestriccionesPrendasZona(restriccionesPrendasZona)
      if (prendasAsignadas.value.length === prendaZona.detalles_productos.length) {
        await eliminarListadoRestriccionesPrendasZona(prendasAsignadas.value.flatMap((r: any) => r.id))
        if (prendaZona.miembro_zona) await obtenerPrendasAsignadas(prendaZona.miembro_zona)
        if (prendaZona.zona) consultarMiembrosZona(prendaZona.zona)
      }
    }

    const quitarPrendas = async (restriccionesPrendasZona: RestriccionPrendaZona[]) => {
      if (restriccionesPrendasZona.length === prendasAsignadas.value.length) return notificarAdvertencia('Deje al menos una prenda asignada.')
      if (!prendasAsignadas.value[0].id) { // Por defecto tienen todas las prendas asi que no existe ningun registro de restriccion en la base de datos (no tienen id pk)
        const prendasParaAsignar = prendasAsignadas.value.filter((rAgregar: RestriccionPrendaZona) => !restriccionesPrendasZona.some((rEliminar) => rEliminar.detalle_producto_id === rAgregar.detalle_producto_id && rEliminar.miembro_zona_id === rAgregar.miembro_zona_id)) // devuelve todas menos las seleccionadas 
        await asignarPrenda(prendasParaAsignar)
      } else { // Si ya existen en la base de datos entonces procede a eliminarlas allá
        await eliminarListadoRestriccionesPrendasZona(restriccionesPrendasZona.flatMap((r: any) => r.id))
      }
      if (prendaZona.zona) consultarMiembrosZona(prendaZona.zona)
    }

    const btnAsignarPrendas = async () => {
      await refPrendasSinAsignar.value.seleccionar()
      await refPrendasSinAsignar.value.clearSelection()
    }

    const btnQuitarPrendas = async () => {
      await refPrendasAsignadas.value.seleccionar()
      await refPrendasAsignadas.value.clearSelection()
    }

    /*********
     * Reglas
     *********/
    const rules = {
      zona: { required },
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, prendaZona)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onConsultado(() => {
      if (prendaZona.zona) consultarMiembrosZona(prendaZona.zona)
      criterioBusquedaEmpleado.value = prendaZona.empleado_apellidos_nombres
      consultarClientesMaterialesEmpleado()
    })

    onReestablecer(() => {
      listadosAuxiliares.miembrosZona = []
      refPrendasSinAsignar.value?.clearSelection()
      refPrendasAsignadas.value?.clearSelection()
      criterioBusquedaEmpleado.value = null
    })

    /***************
     * Orquestador
     ***************/
    const {
      refListadoSeleccionable: refListadoSeleccionableDetalleProducto,
      criterioBusqueda: criterioBusquedaDetalleProducto,
      listado: listadoDetalleProducto,
      listar: listarDetalleProducto,
      limpiar: limpiarDetalleProducto,
      seleccionar: seleccionarDetalleProducto,
    } = useOrquestadorSelectorDetalles(prendaZona, 'materiales_empleado')

    const {
      refListadoSeleccionable: refListadoSeleccionableEmpleado,
      criterioBusqueda: criterioBusquedaEmpleado,
      listado: listadoEmpleado,
      listar: listarEmpleado,
      seleccionar: seleccionarEmpleado,
    } = useOrquestadorSelectorEmpleados(prendaZona, 'empleados', 'empleado_id')

    return {
      v$,
      mixin,
      prendaZona,
      disabled,
      listadosAuxiliares,
      configuracionColumnasPrendaZona,
      configuracionColumnasDetallesModal,
      configuracionColumnasProductosSeleccionados,
      configuracionColumnasRestriccionPrendaZona,
      ccEmpleadoDesignado: [...configuracionColumnasEmpleadoDesignado, {
        name: 'tiene_restriccion',
        field: 'tiene_restriccion',
        label: 'Tiene restricción de acceso a las prendas de la zona',
        align: 'left',
      },],
      zonas,
      filtrarZonas,
      ordenarLista,
      iconos,
      recargarListados,
      eliminarDetalleProductoSeleccionado,
      consultarMiembrosZona,
      prendasSinAsignar,
      prendasAsignadas,
      asignarPrenda,
      quitarPrendas,
      btnAsignarPrendas,
      btnQuitarPrendas,
      obtenerPrendasAsignadas,
      refPrendasAsignadas,
      refPrendasSinAsignar,
      errorExisteZona,
      accion,
      acciones,
      configuracionColumnasEmpleadosLite,
      seleccionarCliente,
      consultarClientesMaterialesEmpleado,
      // Orquestador detalles de productos
      refListadoSeleccionableDetalleProducto,
      criterioBusquedaDetalleProducto,
      listadoDetalleProducto,
      listarDetalleProducto,
      limpiarDetalleProducto,
      seleccionarDetalleProducto,
      // Orquestador empleado
      refListadoSeleccionableEmpleado,
      criterioBusquedaEmpleado,
      listadoEmpleado,
      listarEmpleado,
      seleccionarEmpleado,
    }
  }
});