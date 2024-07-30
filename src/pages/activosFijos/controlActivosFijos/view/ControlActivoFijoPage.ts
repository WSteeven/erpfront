// Dependencias
import { configuracionColumnasEntregasActivosFijos } from '../domain/configuracionColumnasEntregasActivosFijos'
import { configuracionColumnasActivosFijos } from '../domain/configuracionColumnasActivosFijos'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import FormularioPermisoArma from 'src/pages/bodega/permisosArmas/view/FormularioPermisoArma.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ActivoFijo } from '../domain/ActivoFijo'
import { ActivoFijoController } from '../infraestructure/ActivoFijoController'
import { useActivoFijoStore } from 'stores/activo_fijo'
import { opcionesConsultasActivosFijos } from 'config/utils/activos_fijos'
import { useConsultarOpcionesActivosFijos } from '../application/ConsultarOpcionesActivosFijos'
import { useAuthenticationStore } from 'stores/authentication'
import { accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
  components: { TabLayout, SelectorImagen, FormularioPermisoArma, EssentialTable },
  setup() {
    /*********
     * Stores
     *********/
    const activoFijoStore = useActivoFijoStore()
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(ActivoFijo, new ActivoFijoController())
    const { entidad: activo, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()

    /************
     * Variables
     ************/
    const tabsOpcionesConsultas = ref()
    const sumaCantidadesEntregadas = computed(() => entregas.value.reduce((acc, entrega: ActivoFijo) => {
      return acc + (entrega.cantidad ?? 0)
    }, 0))
    /* const parametrosDefecto = {
      detalle_producto_id: activo.detalle_producto.id,
      cliente_id: 1,
    } */

    /************
     * Funciones
     ************/
    const { entregas, listarEntregas } = useConsultarOpcionesActivosFijos()

    /******************
     * Acciones tabla
     ******************/
    const btnSubirActaEntregaRecepcion: CustomActionTable = {
      titulo: 'Subir acta de entrega recepción',
      icono: 'bi-upload',
      color: 'primary',
      accion: ({ entidad, posicion }) => {
        //
      }
    }

    const btnSubirJustificativoUso: CustomActionTable = {
      titulo: 'Justificativo de uso',
      icono: 'bi-upload',
      color: 'positive',
      accion: ({ entidad, posicion }) => {
        //
      }
    }

    /************
     * Observers
     ************/
    const consultar = () => {
      switch (tabsOpcionesConsultas.value) {
        case opcionesConsultasActivosFijos.ENTREGAS: listarEntregas({
          detalle_producto_id: activo.detalle_producto.id,
          cliente_id: activo.cliente,
        })
          break
      }
    }

    /********
     * Hooks
     ********/
    onConsultado(() => consultar())

    /*******
     * Init
     *******/
    tabsOpcionesConsultas.value = opcionesConsultasActivosFijos.ENTREGAS

    return {
      mixin, activo, disabled, accion,
      configuracionColumnas: configuracionColumnasActivosFijos,
      configuracionColumnasEntregasActivosFijos,
      accionesTabla,
      sumaCantidadesEntregadas,
      opcionesConsultasActivosFijos,
      tabsOpcionesConsultas,
      entregas,
      listarEntregas,
      consultar,
      btnSubirActaEntregaRecepcion,
      btnSubirJustificativoUso,
    }
  }
})
