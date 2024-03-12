//Dependencias
import { configuracionColumnasServicios } from "../domain/configuracionColumnasServicios";
import { defineComponent, reactive, ref } from "vue";
import { required, minValue, maxValue, requiredIf } from "shared/i18n-validators";

//Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue"

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Servicio } from "../domain/Servicio";
import { ServicioController } from "../infraestructure/ServicioController";
import useVuelidate from "@vuelidate/core";
import { tabOptionsSeguros, tabOptionsServicios, tiposServicios } from "config/vehiculos.utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { CambiarEstadoServicio } from "../application/CambiarEstadoServicio";
import { useNotificaciones } from "shared/notificaciones";
import { useAuthenticationStore } from "stores/authentication";

export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Servicio, new ServicioController())
        const { entidad: servicio, disabled, listadosAuxiliares, accion, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()
        const store = useAuthenticationStore()

        /*****************************
         * VARIABLES
         ****************************/
        const TIPO_PREVENTIVO = 'PREVENTIVO'
        const TIPO_CORRECTIVO = 'CORRECTIVO'

        /*****************************
         * VALIDACIONES
         ****************************/
        const reglas = {
            nombre: { required },
            tipo: { required },
            intervalo: { requiredIf: requiredIf(() => servicio.tipo == TIPO_PREVENTIVO) },
        }
        const v$ = useVuelidate(reglas, servicio)
        setValidador(v$.value)

        /*********************************
         * Funciones
        *********************************/
        onGuardado((id, response) => {
            emit('cerrar-modal', false)
            emit('guardado', { formulario: 'ServicioPage', id: id, modelo: response.modelo })
        })

        /*********************************
         * Funciones
        *********************************/
        async function filtrarServicios(tab: string) {
            switch (tab) {
                case TIPO_PREVENTIVO:
                    listar({
                        'tipo': tab,
                    })
                    break
                case TIPO_CORRECTIVO:
                    listar({
                        'tipo': tab,
                    })
                    break
                default:
                    listar()
            }
        }

        /**************************************************************
         * Botones de tablas
         **************************************************************/
        const btnDesactivar: CustomActionTable = {
            titulo: 'Desactivar',
            color: 'negative',
            icono: 'bi-toggle2-off',
            tooltip: 'Desactivar servicio',
            accion: ({ entidad, posicion }) => {
                confirmar('¿Está seguro de desactivar el servicio?', async () => {
                    try {
                        const { result } = await new CambiarEstadoServicio().anular(entidad.id)
                        if (!result.estado) {
                            notificarCorrecto('Servicio desactivado con éxito')
                            listado.value.splice(posicion, 1, result)
                        }
                    } catch (e: any) {
                        notificarError('No se pudo desactivar el servicio')
                    }

                })
            },
            visible: ({ entidad, posicion }) => {
                return entidad.estado && store.esAdministradorVehiculos
            }
        }
        const btnActivar: CustomActionTable = {
            titulo: 'Activar',
            color: 'positive',
            icono: 'bi-toggle2-on',
            tooltip: 'Activar Servicio',
            accion: ({ entidad, posicion }) => {
                confirmar('¿Está seguro de activar el servicio?', async () => {
                    try {
                        const { result } = await new CambiarEstadoServicio().anular(entidad.id)
                        if (result.estado) {
                            notificarCorrecto('Servicio activado con éxito')
                            listado.value.splice(posicion, 1, result)
                        }
                    } catch (e: any) {
                        notificarError('No se pudo activar el servicio')
                    }

                })
            },
            visible: ({ entidad, posicion }) => {
                return !entidad.estado && store.esAdministradorVehiculos
            }
        }

        return {
            mixin, servicio, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasServicios,
            //listados
            tiposServicios,

            //tabs
            tabOptionsServicios,


            //functiones
            filtrarServicios,

            //botones de tabla
            btnDesactivar, btnActivar,

        }
    }
})