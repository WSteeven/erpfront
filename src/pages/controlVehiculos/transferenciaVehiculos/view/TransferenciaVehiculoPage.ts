// Dependencias
import { configuracionColumnasTransferenciasVehiculos } from "../domain/configuracionColumnasTransferenciasVehiculos";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { computed, defineComponent, ref } from "vue";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { acciones, maskFecha } from "config/utils";


//Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue"
import GestorArchivos from "components/gestorArchivos/GestorArchivos.vue";


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
import { imprimirArchivo, obtenerFechaActual } from "shared/utils";
import { ConductorController } from "pages/controlVehiculos/conductores/infraestructure/ConductorController";
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { LocalStorage } from "quasar";
import { recargarGenerico } from "shared/funcionesActualizacionListados";
import { useVehiculoStore } from "stores/vehiculos/vehiculo";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { ParamsType } from "config/types";
import { AxiosResponse } from "axios";


export default defineComponent({
    components: { TabLayoutFilterTabs2, GestorArchivos },
    setup() {
        const mixin = new ContenedorSimpleMixin(TransferenciaVehiculo, new TransferenciaVehiculoController())
        const { entidad: transferencia, disabled, listadosAuxiliares, accion, listado, tabs } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar, consultar } = mixin.useComportamiento()
        const { onGuardado, onConsultado, onReestablecer, onBeforeGuardar } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()

        //stores
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()
        const vehiculoStore = useVehiculoStore()
        const [pendiente, aceptado, rechazado, anulado] = estadosAsignacionesVehiculos
        const tabActual = ref(pendiente.label)
        const refArchivo = ref()
        const idRegistro = ref()
        const btnSubirArchivos = ref(false)

        let accesoriosDefault = [
            'GATA HIDRAULICA',
            'LLANTA DE EMERGENCIA',
            'TRIANGULOS REFLECTIVOS'
        ]
        const accesorios = ref(accesoriosDefault)
        let estadosDefault = [
            'SIN CHOQUES',
            'EN BUEN ESTADO',
            'EN PERFECTAS CONDICIONES',
        ]
        let motivosDefault = [
            'FIN DE CONTRATO',
            'SALIDA DE VACACIONES',
            'PERMISOS (ESPECIFICAR)',
            'CAMBIO DE GRUPO',
        ];
        const estados = ref(estadosDefault)
        const motivos = ref(motivosDefault)



        const {
            empleados, filtrarEmpleados,
            cantones, filtrarCantones,
            vehiculos, filtrarVehiculos } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                empleados: new ConductorController(),
                vehiculos: new VehiculoController(),
            })
            //listados
            empleados.value = listadosAuxiliares.empleados
            vehiculos.value = listadosAuxiliares.vehiculos
            listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
            cantones.value = listadosAuxiliares.cantones

            obtenerAccesoriosLS()

            transferencia.entrega = store.user.id
            transferencia.estado = pendiente.label
            transferencia.fecha_entrega = obtenerFechaActual(maskFecha)

            //si hay una asignación se llenarán los campos en la transferencia
            if (vehiculoStore.asignacion.id) {
                await cargarDatosAsignacion()
            }
        })

        /*********************************
         * Validaciones
         *********************************/
        const reglas = {
            vehiculo: { required },
            canton: { required },
            accesorios: { required },
            motivo: { required },
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
        onGuardado((id: number) => {
            idRegistro.value = id
            setTimeout(async () => {
                subirArchivos()
            }, 1)

            vehiculoStore.resetearAsignacionVehiculo()
        })
        onConsultado(() => {
            setTimeout(() => {
                refArchivo.value.listarArchivosAlmacenados(transferencia.id)
            }, 1)
            LocalStorage.set('accesoriosVehiculos', JSON.stringify(transferencia.accesorios))
            //concatenamos los valores de las 3 variables para tener uno solo 
            const estadosDB = [...(transferencia.estado_mecanico ? transferencia.estado_mecanico : []), ...(transferencia.estado_electrico ? transferencia.estado_electrico : []), ...(transferencia.estado_electrico ? transferencia.estado_electrico : [])]
            // console.log(transferencia, estadosDB)
            const todosNulos = estadosDB.every(function (value) { return value === null })

            // console.log(todosNulos)
            if (todosNulos)
                LocalStorage.set('estadosVehiculos', JSON.stringify(estadosDefault))
            else
                LocalStorage.set('estadosVehiculos', JSON.stringify(Array.from(new Set(estadosDB))))

            obtenerAccesoriosLS()
        })
        onReestablecer(() => {
            refArchivo.value.limpiarListado()
            transferencia.entrega = store.user.id
            transferencia.estado = pendiente.label

            transferencia.fecha_entrega = obtenerFechaActual(maskFecha)
        })

        /*********************************
         * FUNCIONES
        *********************************/

        async function subirArchivos() {
            await refArchivo.value.subir()
        }

        async function cargarDatosAsignacion() {
            // Copiamos los valores de las variables de asignacion en la transferencia
            console.log("A copiar", vehiculoStore.asignacion)
            transferencia.asignacion = vehiculoStore.asignacion.id
            transferencia.vehiculo = vehiculoStore.asignacion.vehiculo_id
            transferencia.entrega = vehiculoStore.asignacion.responsable_id
            transferencia.canton = vehiculoStore.asignacion.canton_id
            transferencia.accesorios = vehiculoStore.asignacion.accesorios
            transferencia.estado_carroceria = vehiculoStore.asignacion.estado_carroceria
            transferencia.estado_mecanico = vehiculoStore.asignacion.estado_mecanico
            transferencia.estado_electrico = vehiculoStore.asignacion.estado_electrico
        }

        /**
          * La función `obtenerAccesoriosLS` recupera y fija el valor de los accesorios de los vehículos
          * almacenados en local storage.
          */
        function obtenerAccesoriosLS() {
            if (LocalStorage.getItem('accesoriosVehiculos')) {
                const accesoriosEnLocalStorageString = LocalStorage.getItem('accesoriosVehiculos')
                const accesoriosEnLocalStorage = JSON.parse(accesoriosEnLocalStorageString?.toString() || '[]')
                accesoriosDefault = accesoriosEnLocalStorage
                accesorios.value = accesoriosEnLocalStorage
            }
            if (LocalStorage.getItem('estadosVehiculos')) {
                const estadosEnLocalStorageString = LocalStorage.getItem('estadosVehiculos')
                const estadosEnLocalStorage = JSON.parse(estadosEnLocalStorageString?.toString() || '[]')
                estadosDefault = estadosEnLocalStorage
                estados.value = estadosEnLocalStorage
            }
            if (LocalStorage.getItem('motivosTransferenciaVehiculos')) {
                const motivosEnLocalStorageString = LocalStorage.getItem('motivosTransferenciaVehiculos')
                const motivosEnLocalStorage = JSON.parse(motivosEnLocalStorageString?.toString() || '[]')
                motivosDefault = motivosEnLocalStorage
                motivos.value = motivosEnLocalStorage
            }
        }
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

        function crearMotivo(val, done) {
            val = val.toUpperCase()
            if (val.length > 0) {
                if (!motivosDefault.includes(val)) {
                    motivosDefault.push(val)
                    done(val, 'add-unique')
                    LocalStorage.set('motivosTransferenciaVehiculos', JSON.stringify(motivosDefault))
                }
            }
        }
        function crearEstado(val, done) {
            val = val.toUpperCase()
            if (val.length > 0) {
                if (!estadosDefault.includes(val)) {
                    estadosDefault.push(val)
                    done(val, 'add-unique')
                    LocalStorage.set('estadosVehiculos', JSON.stringify(estadosDefault))
                }
            }
        }

        function crearAccesorio(val, done) {
            val = val.toUpperCase()
            if (val.length > 0) {
                if (!accesoriosDefault.includes(val)) {
                    accesoriosDefault.push(val)
                    done(val, 'add-unique')
                    LocalStorage.set('accesoriosVehiculos', JSON.stringify(accesoriosDefault))
                }
            }
        }
        function filtrarMotivos(val, update) {
            val = val.toUpperCase()
            update(() => {
                if (val == '') motivos.value = motivosDefault
                else {
                    motivos.value = motivosDefault.filter(v => v.toUpperCase().indexOf(val) > -1)
                }
            })
        }
        function filtrarEstados(val, update) {
            val = val.toUpperCase()
            update(() => {
                if (val == '') estados.value = estadosDefault
                else {
                    estados.value = estadosDefault.filter(v => v.toUpperCase().indexOf(val) > -1)
                }
            })
        }

        function filtrarAccesorios(val, update) {
            val = val.toUpperCase()
            update(() => {
                if (val == '') accesorios.value = accesoriosDefault
                else {
                    accesorios.value = accesoriosDefault.filter(v => v.toUpperCase().indexOf(val) > -1)
                }
            })
        }

        async function recargarVehiculos() {
            await recargarGenerico(listadosAuxiliares, 'vehiculos', vehiculos, new VehiculoController())
        }

        async function recargarEmpleados() {
            await recargarGenerico(listadosAuxiliares, 'empleados', empleados, new ConductorController())
        }

        async function devolverVehiculo(id: number, params: ParamsType) {
            try {
                cargando.activar()
                const axios = AxiosHttpRepository.getInstance()
                const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transferencias_vehiculos) + '/devolver-vehiculo/' + id
                const response: AxiosResponse = await axios.post(url, params)
                if (response.status = 200) {
                    notificarCorrecto(response.data.mensaje)
                    return true
                } else notificarAdvertencia(response.data.mensaje)
            } catch (error) {
                notificarError('Error al marcar como pagada la matrícula. ' + error)
            } finally {
                cargando.desactivar()
            }
        }

        /**************************
        * BOTONES DE TABLA
        ***************************/
        const btnImprimirActaResponsabilidadTransferencia: CustomActionTable = {
            titulo: 'Imprimir Acta',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                await imprimirPdf(entidad.id, entidad.vehiculo)
            },
            visible: () => tabActual.value === aceptado.label
        }

        const btnDevolverVehiculo: CustomActionTable = {
            titulo: 'Devolver Vehículo',
            color: 'primary',
            accion: async ({ entidad }) => {
                const data: CustomActionPrompt = {
                    titulo: 'Observación',
                    mensaje: 'Ingrese alguna observación',
                    requerido: true,
                    accion: async (data) => {
                        //Aqui se guarda a la base de datos
                        await devolverVehiculo(entidad.id, { observacion: data })
                        await filtrarTransferencias(tabActual.value)
                    }
                }
                prompt(data)
            },
            visible: ({ entidad }) => tabActual.value === aceptado.label && (store.user.id === entidad.responsable_id || store.esAdministradorVehiculos)
        }

        const btnTransferirVehiculo: CustomActionTable = {
            titulo: 'Transferir',
            tooltip: 'Transferir el vehículo a otro chofer',
            color: 'positive',
            icono: 'bi-arrow-left-right',
            accion: async ({ entidad, posicion }) => {
                console.log('Diste clicn en transferir un vehículo', entidad)
                accion.value = acciones.nuevo
                // Se asignan los valores de la entidad al objeto transferencia
                transferencia.hydrate(new TransferenciaVehiculo())
                transferencia.vehiculo = entidad.vehiculo_id
                transferencia.entrega = entidad.responsable_id
                transferencia.canton = null
                transferencia.responsable = null
                transferencia.responsable_id = null
                transferencia.observacion_recibe = null
                transferencia.observacion_entrega = null
                transferencia.fecha_entrega = obtenerFechaActual(maskFecha)
                transferencia.motivo = null
                transferencia.estado = pendiente.label
                transferencia.accesorios = entidad.accesorios
                transferencia.estado_carroceria = entidad.estado_carroceria
                transferencia.estado_mecanico = entidad.estado_mecanico
                transferencia.estado_electrico = entidad.estado_electrico
                transferencia.fecha_aceptacion = null
                transferencia.devuelve = null
                transferencia.asignacion = null
                transferencia.transferencia = entidad.id
                transferencia.entrega = entidad.responsable
                transferencia.responsable = null
                transferencia.responsable_id = null
                tabs.value = 'formulario'

                console.log('Objeto Transferencia', transferencia)
            },
            visible: ({ entidad }) => tabActual.value === aceptado.label && store.user.id === entidad.responsable_id
        }


        return {
            mixin, transferencia, v$, accion, acciones, disabled,
            configuracionColumnas: configuracionColumnasTransferenciasVehiculos,
            tabActual,
            refArchivo,
            idRegistro,
            btnSubirArchivos,
            store,
            tabOptions: tabOptionsTransferenciasVehiculos,


            //lists for selects
            empleados, filtrarEmpleados,
            cantones, filtrarCantones,
            vehiculos, filtrarVehiculos,
            estadosTransferenciasVehiculos: estadosAsignacionesVehiculos,
            accesorios,
            motivos,
            estados,

            //functions
            filtrarTransferencias,
            crearMotivo, filtrarMotivos,
            crearAccesorio, filtrarAccesorios,
            crearEstado, filtrarEstados,
            recargarVehiculos,
            recargarEmpleados,
            subirArchivos,

            //tableButtons
            btnImprimirActaResponsabilidadTransferencia,
            btnDevolverVehiculo,
            btnTransferirVehiculo,

        }
    }
})