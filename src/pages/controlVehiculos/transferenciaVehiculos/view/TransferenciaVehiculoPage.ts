// Dependencias
import { configuracionColumnasTransferenciasVehiculos } from "../domain/configuracionColumnasTransferenciasVehiculos";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { computed, defineComponent, ref } from "vue";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { acciones } from "config/utils";


//Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue"


//Logica y controladores
import { TransferenciaVehiculoController } from "../infraestructure/TransferenciaVehiculoController";
import { TransferenciaVehiculo } from "../domain/TransferenciaVehiculo";
import { useAuthenticationStore } from "stores/authentication";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useNotificaciones } from "shared/notificaciones";
import { estadosAsignacionesVehiculos, tabOptionsTransferenciasVehiculos } from "config/vehiculos.utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { apiConfig, endpoints } from "config/api";
import { imprimirArchivo } from "shared/utils";


export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup() {
        const mixin = new ContenedorSimpleMixin(TransferenciaVehiculo, new TransferenciaVehiculoController())
        const { entidad: transferencia, disabled, listadosAuxiliares, accion, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar, } = mixin.useComportamiento()
        const { onConsultado, onReestablecer, onBeforeGuardar } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()

        //stores
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()
        const [pendiente, aceptado, rechazado, anulado] = estadosAsignacionesVehiculos
        const tabActual = ref(pendiente.label)


        cargarVista(async () => {
            await obtenerListados({

            })
        })

        /*********************************
         * Validaciones
         *********************************/
        const reglas = {
            vehiculo: { required },
            canton: { required },
            accesorios: { required },
            estado_carroceria: { required },
            estado_mecanico: { required },
            estado_electrico: { required },
            responsable: { required },
            fecha_entrega: { required },
        }
        const v$ = useVuelidate(reglas, transferencia)
        setValidador(v$.value)


        /*********************************
         * HOOKS
        *********************************/


        /*********************************
         * FUNCIONES
        *********************************/
        async function filtrarTransferencias(tab: string) {
            tabActual.value = tab
            switch (tab) {
                case pendiente.label:
                    listar({
                        estado: pendiente.label,
                    })
                    break
                case aceptado.label: //aceptadas
                    listar({
                        estado: aceptado.label,
                        devuelto: 0,
                    })
                    break
                case anulado.label:
                    listar({
                        estado: anulado.label,
                    })
                    break
                default: //aqui van las rechazadas
                    listar({
                        estado: rechazado.label,
                    })
            }
        }

        async function imprimirPdf(id: number, placa: string) {
            try {
                cargando.activar()
                const axios = AxiosHttpRepository.getInstance()
                const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transferencias_vehiculos) + '/imprimir/' + id
                const filename = 'acta_transferencia_vehiculo_' + placa + '_' + Date.now()
                await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
            } catch (e) {
                notificarAdvertencia('Error al imprimir el acta. ' + e)
            } finally {
                cargando.desactivar()
            }
        }

        /**************************
        * BOTONES DE TABLA
        ***************************/
        const btnImprimirActaResponsabilidadTransferencia: CustomActionTable ={
            titulo: 'Imprimir Acta',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                await imprimirPdf(entidad.id, entidad.vehiculo)
            },
            visible: () => tabActual.value === aceptado.label   
        }


        return {
            mixin, v$, accion, acciones, disabled,
            configuracionColumnas: configuracionColumnasTransferenciasVehiculos,
            tabActual,
            
            tabOptions: tabOptionsTransferenciasVehiculos,

            
            filtrarTransferencias,

            btnImprimirActaResponsabilidadTransferencia,

        }
    }
})