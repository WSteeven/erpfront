//Dependencias
import { computed, defineComponent, ref } from 'vue';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { configuracionColumnasAsignacionVehiculos } from '../domain/configuracionColumnasAsignacionVehiculos';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';

//Components
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';

// Logica y controladores
import { AsignacionVehiculo } from '../domain/AsignacionVehiculo';
import { AsignacionVehiculoController } from '../infraestructure/AsignacionVehiculoController';
import { tabOptionsAsignacionVehiculos, estadosAsignacionesVehiculos } from 'config/vehiculos.utils';
import { ConductorController } from 'pages/controlVehiculos/conductores/infraestructure/ConductorController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { imprimirArchivo, obtenerFechaActual, obtenerUbicacion, ordenarLista } from 'shared/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { acciones, convertir_fecha, maskFecha } from 'config/utils';
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { apiConfig, endpoints } from 'config/api';
import { useNotificaciones } from 'shared/notificaciones';
import { LocalStorage, useQuasar } from 'quasar';
import { useNotificacionStore } from 'stores/notificacion';
import { useCargandoStore } from 'stores/cargando';
import { recargarGenerico } from 'shared/funcionesActualizacionListados';
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt';
import { ParamsType } from 'config/types';
import { AxiosResponse } from 'axios';
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController';
import { useVehiculoStore } from 'stores/vehiculos/vehiculo';
import { useRouter } from 'vue-router';
import { ValidarImagenesAdjuntas } from '../application/validation/ValidarImagenesAdjuntas';
import { GarajeController } from 'pages/controlVehiculos/garajes/infraestructure/GarajeController';


export default defineComponent({
    name: 'AsignacionVehiculo',
    components: { TabLayoutFilterTabs2, GestorArchivos },
    setup() {
        const mixin = new ContenedorSimpleMixin(AsignacionVehiculo, new AsignacionVehiculoController(), new ArchivoController())
        const { entidad: asignacion, disabled, listadosAuxiliares, accion, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar, } = mixin.useComportamiento()
        const { onGuardado, onBeforeModificar, onConsultado, onReestablecer, onBeforeConsultar } = mixin.useHooks()
        const { prompt, notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()

        //stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const vehiculoStore = useVehiculoStore()
        const cargando = new StatusEssentialLoading()
        const router = useRouter()

        const [pendiente, aceptado, rechazado, anulado] = estadosAsignacionesVehiculos
        const tabActual = ref(pendiente.label)
        const refArchivo = ref()
        const idRegistro = ref()
        const btnSubirArchivos = ref(false)
        const esResponsable = ref(false)
        const puedeEditar = computed(() => tabActual.value == pendiente.label && listado.value.some((item) => item.responsable_id == store.user.id || item.entrega_id == store.user.id))
        const soloLectura = computed(() => accion.value == acciones.editar)
        const FIRMADA = 'FIRMADA'

        const garajes = ref([])
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
        const estados = ref(estadosDefault)

        const {
            empleados, filtrarEmpleados,
            cantones, filtrarCantones,
            vehiculos, filtrarVehiculos } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                empleados: new ConductorController(),
                vehiculos: new VehiculoController(),
                garajes: {
                    controller: new GarajeController(),
                    params: { activo: 1 }
                }
            })
            //listados
            empleados.value = listadosAuxiliares.empleados
            vehiculos.value = listadosAuxiliares.vehiculos
            garajes.value = listadosAuxiliares.garajes
            listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
            cantones.value = listadosAuxiliares.cantones

            obtenerAccesoriosLS()

            asignacion.entrega = store.user.id
            asignacion.estado = pendiente.label
            asignacion.fecha_entrega = obtenerFechaActual(maskFecha)
        })
        /*********************************
         * Validaciones
         *********************************/
        const reglas = {
            vehiculo: { required },
            canton: { required },
            accesorios: { required },
            garaje: { required },
            latitud: { required },
            longitud: { required },
            estado_carroceria: { required },
            estado_mecanico: { required },
            estado_electrico: { required },
            responsable: { required },
            fecha_entrega: { required },
        }
        const v$ = useVuelidate(reglas, asignacion)
        setValidador(v$.value)

        const validarImagenesAdjuntas = new ValidarImagenesAdjuntas(refArchivo, asignacion)
        mixin.agregarValidaciones(validarImagenesAdjuntas)


        /*********************************
         * HOOKS
        *********************************/
        onBeforeConsultar(() => btnSubirArchivos.value = false)
        onGuardado((id: number) => {
            idRegistro.value = id
            setTimeout(async () => {
                await subirArchivos()
            }, 1)
        })
        onBeforeModificar(() => {
            idRegistro.value = asignacion.id
            setTimeout(() => subirArchivos(), 1)
        })
        onConsultado((entidad) => {
            console.log(entidad)
            esResponsable.value = store.user.id === entidad.responsable_id
            setTimeout(() => {
                refArchivo.value.listarArchivosAlmacenados(asignacion.id)
            }, 1)
            LocalStorage.set('accesoriosVehiculos', JSON.stringify(asignacion.accesorios))
            //concatenamos los valores de las 3 variables para tener uno solo 
            const estadosDB = [...(asignacion.estado_mecanico ? asignacion.estado_mecanico : []), ...(asignacion.estado_electrico ? asignacion.estado_electrico : []), ...(asignacion.estado_electrico ? asignacion.estado_electrico : [])]
            // console.log(asignacion, estadosDB)
            const todosNulos = estadosDB.every(function (value) { return value === null })

            // console.log(todosNulos)
            if (todosNulos)
                LocalStorage.set('estadosVehiculos', JSON.stringify(estadosDefault))
            else
                LocalStorage.set('estadosVehiculos', JSON.stringify(Array.from(new Set(estadosDB))))

            obtenerAccesoriosLS()
        })
        onReestablecer(() => {
            setTimeout(() => {
                refArchivo.value.limpiarListado()
                refArchivo.value.quiero_subir_archivos = false
                refArchivo.value.cantElementos = 0
            }, 300)
            asignacion.entrega = store.user.id
            asignacion.estado = pendiente.label

            asignacion.fecha_entrega = obtenerFechaActual(maskFecha)
        })
        /*********************************
         * Funciones
        *********************************/
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
        }
        async function filtrarAsignaciones(tab: string) {
            tabActual.value = tab
            switch (tab) {
                case pendiente.label:
                    listar({
                        estado: pendiente.label,
                    })
                    break
                case FIRMADA: //aceptadas
                    listar({
                        estado: aceptado.label,
                        devuelto: 0,
                        transferido: 0,
                    })
                    break
                case anulado.label:
                    listar({
                        estado: anulado.label,
                    })
                    break
                case 'DEVUELTO':
                    listar({
                        devuelto: 1,
                    })
                    break
                default: //aqui van las rechazadas
                    listar({
                        estado: rechazado.label,
                    })
            }
        }
        function optionsFecha(date) {
            const hoy = convertir_fecha(new Date())
            return date <= hoy
        }

        async function subirArchivos() {
            await refArchivo.value.subir()
        }
        function obtenerCoordenadas() {
            obtenerUbicacion((ubicacion) => {
                asignacion.latitud = ubicacion.coords.latitude
                asignacion.longitud = ubicacion.coords.longitude
            })
        }

        async function imprimirPdf(id: number, placa: string) {
            try {
                cargando.activar()
                const axios = AxiosHttpRepository.getInstance()
                const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.asignaciones_vehiculos) + '/imprimir/' + id
                const filename = 'acta_resposabilidad_vehiculo_' + placa + '_' + Date.now()
                await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
            } catch (e) {
                notificarAdvertencia('Error al imprimir el acta. ' + e)
            } finally {
                cargando.desactivar()
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
        async function recargarGarajes() {
            await recargarGenerico(listadosAuxiliares, 'garajes', garajes, new GarajeController(), { activo: 1 })
        }
        async function recargarEmpleados() {
            await recargarGenerico(listadosAuxiliares, 'empleados', empleados, new ConductorController())
        }

        async function devolverVehiculo(id: number, params: ParamsType) {
            try {
                cargando.activar()
                const axios = AxiosHttpRepository.getInstance()
                const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.asignaciones_vehiculos) + '/devolver-vehiculo/' + id
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
        * Botones de tabla
        ***************************/
        const btnImprimirActaResponsabilidad: CustomActionTable = {
            titulo: 'Imprimir Acta',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                await imprimirPdf(entidad.id, entidad.vehiculo)
            },
            visible: () => tabActual.value === FIRMADA
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
                        await filtrarAsignaciones(tabActual.value)
                    }
                }
                prompt(data)
            },
            visible: () => tabActual.value === FIRMADA
        }
        const btnTransferirVehiculo: CustomActionTable = {
            titulo: 'Transferir',
            tooltip: 'Transferir el vehículo a otro chofer',
            color: 'positive',
            icono: 'bi-arrow-left-right',
            accion: ({ entidad, posicion }) => {
                vehiculoStore.idAsignacion = entidad.id
                vehiculoStore.asignacion = entidad
                // console.log('Asignación de vehículo a transferir: ', vehiculoStore.asignacion)
                router.push('transferencias-vehiculos')
            },
            visible: () => tabActual.value === FIRMADA
        }

        return {
            mixin, v$, accion, acciones, disabled,
            tabActual,
            asignacion,
            configuracionColumnas: configuracionColumnasAsignacionVehiculos,
            tabOptions: tabOptionsAsignacionVehiculos,
            maskFecha,
            store,
            puedeEditar, soloLectura,
            refArchivo,
            idRegistro,

            btnSubirArchivos,
            esResponsable,


            //listados
            listadosAuxiliares,
            empleados, filtrarEmpleados,
            vehiculos, filtrarVehiculos,
            cantones, filtrarCantones,
            estadosAsignacionesVehiculos,
            accesorios,
            estados,
            garajes,


            //funciones
            filtrarAsignaciones,
            ordenarLista,
            optionsFecha,
            crearAccesorio,
            filtrarAccesorios,
            crearEstado,
            filtrarEstados,
            recargarEmpleados,
            recargarVehiculos,
            recargarGarajes,
            subirArchivos,
            obtenerCoordenadas,

            //botones de tablas
            btnImprimirActaResponsabilidad,
            btnTransferirVehiculo,
            btnDevolverVehiculo,
        }
    }
})