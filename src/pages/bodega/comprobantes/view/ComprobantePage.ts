//Dependencies
import { configuracionColumnasTransaccionEgreso } from 'pages/bodega/transacciones/domain/configuracionColumnasTransaccionEgreso';
import { tabGestionarEgresos, accionesTabla } from 'config/utils';

//Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue';

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion';
import { TransaccionController } from 'pages/bodega/transacciones/infraestructure/TransaccionController';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso';
import { defineComponent } from "vue";
import { ComportamientoModalesGestionarEgreso } from 'pages/bodega/transacciones/modules/GestionarEgreso/application/ComportamientoModalesGestionarEgreso';


export default defineComponent({
    components: { EssentialTableTabs, ModalEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionController())
        const { entidad: transaccion, listado } = mixin.useReferencias()
        const { listar } = mixin.useComportamiento()
        const statusLoading = new StatusEssentialLoading()
        //stores
        const transaccionStore = useTransaccionEgresoStore()

        // modales
        const modales = new ComportamientoModalesGestionarEgreso()

        // funciones
        async function filtrarTabs(tabSeleccionado) {
            statusLoading.activar()
            const result = await transaccionStore.filtrarTransaccionesEgresos(tabSeleccionado)
            listado.value = result
        }

        filtrarTabs('PENDIENTE')


        const botonVerTransaccion:CustomActionTable={
            titulo:'',
            icono:'bi-eye',
            color:'primary',
            accion: async({entidad})=>{
                transaccionStore.idTransaccion = entidad.id
                await transaccionStore.showPreview()
                modales.abrirModalEntidad('VisualizarEgresoPage')
            }
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'positive',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                transaccionStore.idTransaccion = entidad.id;
                await transaccionStore.imprimirEgreso()
            }
        }
        return {
            mixin, transaccion, listado,
            configuracionColumnas: configuracionColumnasTransaccionEgreso,

            tabGestionarEgresos, accionesTabla, modales, filtrarTabs,
            botonVerTransaccion, botonImprimir,
        }
    }
})