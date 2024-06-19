// Dependencies
import { configuracionColumnasRetencionesChargebacks } from '../domain/configuracionColumnasRetencionesChargeback'

//Components
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { defineComponent, ref } from 'vue';
import { Retencion } from '../domain/Retencion';
import { RetencionController } from '../infraestructure/RetencionController';
import { useNotificaciones } from 'shared/notificaciones';
import { useQuasar } from 'quasar';
import { useCargandoStore } from 'stores/cargando';
import { useNotificacionStore } from 'stores/notificacion';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { acciones } from 'config/utils';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { apiConfig, endpoints } from 'config/api';
import { AxiosResponse } from 'axios';
import { tabOptionsRetenciones } from 'config/ventas.utils';



export default defineComponent({
    components: { TabLayoutFilterTabs2, },
    setup() {
        const mixin = new ContenedorSimpleMixin(Retencion, new RetencionController())
        const { entidad: retencion, accion, disabled, listado } = mixin.useReferencias()
        const { setValidador, cargarVista, listar } = mixin.useComportamiento()
        const { onGuardado, onReestablecer } = mixin.useHooks()
        const { notificarCorrecto, notificarAdvertencia, notificarError, confirmar, prompt } = useNotificaciones()
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())

        const cargando = new StatusEssentialLoading()

        const tabDefecto = ref('0')

        /*****************************************************************************************
         * FUNCIONES
         ****************************************************************************************/
        function filtrarRetenciones(tab: string) {
            tabDefecto.value = tab
            listar({ pagado: tab })
        }

        /*****************************************************************************************
        * BOTONES DE TABLA
        ****************************************************************************************/
        const btnMarcarPagado: CustomActionTable = {
            titulo: 'Completada',
            color: 'primary',
            icono: 'bi-check-circle-fill',
            accion: ({ entidad }) => {
                confirmar('¿Está seguro de marcar como completado el corte de pago de comisiones?', async () => {
                    try {
                        cargando.activar()
                        const axios = AxiosHttpRepository.getInstance()
                        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.retenciones_chargebacks) + '/marcar-pagada/' + entidad.id
                        const response: AxiosResponse = await axios.get(url)
                        if (response.status === 200) {
                            notificarCorrecto(response.data.mensaje)
                            await filtrarRetenciones('1')
                        }
                        else notificarAdvertencia(response.data.mensaje)
                    } catch (error: any) {
                        notificarError(error)
                    } finally {
                        cargando.desactivar()
                    }
                })
            },
            visible: ({ entidad }) => entidad.estado == 'PENDIENTE'
        }

        return {
            mixin, retencion, accion, acciones, disabled,
            tabDefecto, tabOptionsRetenciones,
            configuracionColumnas: configuracionColumnasRetencionesChargebacks,

            //functions
            filtrarRetenciones,

            //botones de tabla
            btnMarcarPagado,


        }
    }
})