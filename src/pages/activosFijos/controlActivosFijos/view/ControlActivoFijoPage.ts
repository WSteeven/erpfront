//Dependencias
import { configuracionColumnasActivosFijos } from '../domain/configuracionColumnasActivosFijos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, onMounted, ref, watch } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import FormularioPermisoArma from 'src/pages/bodega/permisosArmas/view/FormularioPermisoArma.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ActivoFijo } from '../domain/ActivoFijo'
import { LocalStorage } from 'quasar'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'
import { ActivoFijoController } from '../infraestructure/ActivoFijoController'
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { useActivoFijoStore } from 'stores/activo_fijo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { opcionesConsultasActivosFijos } from 'config/utils/activos_fijos'
import { configuracionColumnasTransaccionEgreso } from 'pages/bodega/transacciones/domain/configuracionColumnasTransaccionEgreso'
import { useConsultarOpcionesActivosFijos } from '../application/ConsultarOpcionesActivosFijos'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  components: { TabLayout, SelectorImagen, FormularioPermisoArma, EssentialTable },
  setup() {
    /*********
     * Stores
     *********/
    const activoFijoStore = useActivoFijoStore()
    const authenticationStore = useAuthenticationStore()

    const mixin = new ContenedorSimpleMixin(ActivoFijo, new ActivoFijoController())
    const { entidad: activo, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    /************
     * Variables
     ************/
    const tabsOpcionesConsultas = ref()
    const parametrosDefecto = {
      responsable_id: 3,
      detalle_producto_id: activo.detalle_producto_id,
    }

    /************
     * Funciones
     ************/
    const { egresos, ingresos, listarEgresos, listarIngresos } = useConsultarOpcionesActivosFijos()

    /************
     * Observers
     ************/
    const consultar = () => {
      switch (tabsOpcionesConsultas.value) {
        case opcionesConsultasActivosFijos.EGRESOS: listarEgresos({ ...parametrosDefecto })
          break
        case opcionesConsultasActivosFijos.INGRESOS: listarIngresos({ ...parametrosDefecto })
          break
      }
    }

    /*******
     * Init
     *******/
    tabsOpcionesConsultas.value = opcionesConsultasActivosFijos.EGRESOS

    return {
      mixin, activo, disabled, accion,
      configuracionColumnas: configuracionColumnasActivosFijos,
      configuracionColumnasTransaccionEgreso,
      opcionesConsultasActivosFijos,
      tabsOpcionesConsultas,
      egresos,
      ingresos,
      listarEgresos,
      listarIngresos,
      consultar,
    }
  }
})
