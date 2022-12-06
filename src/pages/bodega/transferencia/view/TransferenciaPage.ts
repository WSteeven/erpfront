//Dependencias
import { configuracionColumnasTransferencias } from "../domain/configuracionColumnasTransferencias";
import { configuracionColumnasProductosSeleccionados } from "pages/bodega/devoluciones/domain/configuracionColumnasProductosSeleccionados";
import { required, requiredIf } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";
import { acciones, estadosSubtareas, } from "config/utils";


//Componentes
import TabLayoutFilterTabs from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { TransferenciaController } from "../infraestructure/TransferenciaController";
import { Transferencia } from "../domain/Transferencia";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from 'quasar'
import { useNotificaciones } from "shared/notificaciones";
import { useOrquestadorSelectorItemsTransaccion } from "pages/bodega/transacciones/modules/transaccionIngreso/application/OrquestadorSelectorDetalles";
import { ComportamientoModalesTransferencia } from "../application/ComportamientoModalesTransferencia";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { TipoTransaccionController } from "pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController";
import { TareaController } from "pages/tareas/controlTareas/infraestructure/TareaController";
import { SubtareaController } from "pages/tareas/subtareas/infraestructure/SubtareaController";
import { MotivoController } from "pages/administracion/motivos/infraestructure/MotivoController";
import { AutorizacionController } from "pages/administracion/autorizaciones/infraestructure/AutorizacionController";
import { EstadosTransaccionController } from "pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController";
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import { useAuthenticationStore } from "stores/authentication";


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transferencia, new TransferenciaController())
        const { entidad: transferencia, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { confirmar, prompt } = useNotificaciones()
        //stores
        const store = useAuthenticationStore()

        const {
            refListadoSeleccionable: refListadoSeleccionableProductos,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorItemsTransaccion(transferencia, 'detalles')

        const modales = new ComportamientoModalesTransferencia()

        const esBodeguero = store.esBodeguero
        const esCoordinador = store.esCoordinador

        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos',
                        estado: 1
                    }
                },
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
                tipos: {
                    controller: new TipoTransaccionController(),
                    params: { tipo: 'EGRESO' }
                },
                tareas: {
                    controller: new TareaController(),
                    params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
                },
                subtareas: {
                    controller: new SubtareaController(),
                    params: {
                        campos: 'id,codigo_subtarea,detalle',
                        estados: [estadosSubtareas.ASIGNADO, estadosSubtareas.EJECUTANDO, estadosSubtareas.PAUSADO]
                    }
                },
                motivos: { controller: new MotivoController(), params: { tipo_transaccion_id: 2 } },
                autorizaciones: {
                    controller: new AutorizacionController(),
                    params: {
                        campos: 'id,nombre'
                    }
                },
                estados: {
                    controller: new EstadosTransaccionController(),
                    params: {
                        campos: 'id,nombre'
                    }
                },
                detalles: {
                    controller: new DetalleProductoController(),
                    params: {
                        campos: 'id,producto_id,descripcion,modelo_id,serial'
                    }
                },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,empresa_id',
                        requiere_bodega: 1,
                        estado: 1,
                    },
                },
            })
        })

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            // tipo: { required },
            cliente: { requiredIfBodeguero: requiredIf(esBodeguero) },
            motivo: { requiredIfBodeguero: requiredIf(esBodeguero) },
            tarea: { requiredIfTarea: requiredIf(transferencia.es_tarea) },
            autorizacion: {
                requiredIfCoordinador: requiredIf(esCoordinador),
                requiredIfEsVisibleAut: requiredIf(false)
            },
            estado: { requiredIfBodega: requiredIf(esBodeguero), },
            observacion_aut: {
                requiredIfObsAutorizacion: requiredIf(false)
                // requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion })
            },
            observacion_est: {
                requiredIfObsEstado: requiredIf(false)
                // requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado })
            },
            listadoProductosTransaccion: { required }//validar que envien datos en el listado
        }
        const v$ = useVuelidate(reglas, transferencia)
        setValidador(v$.value)

        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados, {
            name: 'cantidad',
            field: 'cantidad',
            label: 'Cantidad',
            align: 'left',
            sortable: false,
        },
        {
            name: 'acciones',
            field: 'acciones',
            label: 'Acciones',
            align: 'right',
            sortable: false,
        }
        ]

        return {
            mixin, transferencia, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTransferencias,
            acciones,
            //listados

            //variables auxiliares

            //modales
            modales,
            //tabla
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,


            //selector
            refListadoSeleccionableProductos,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,

            limpiarProducto,
            seleccionarProducto,

            //tabs y filtros
            tabOptionsTransacciones,
            puedeEditar,
            tabSeleccionado,

            tabEs(val) {
                tabSeleccionado.value = val
                puedeEditar.value = (esBodeguero && tabSeleccionado.value === 'PENDIENTE') || (esBodeguero && tabSeleccionado.value === 'PARCIAL')
                    ? true
                    : esCoordinador && tabSeleccionado.value === 'ESPERA'
                        ? true
                        : false

            },





        }

    }

})