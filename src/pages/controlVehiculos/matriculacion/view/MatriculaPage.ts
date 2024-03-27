// Dependencies
import { configuracionColumnasMatriculas } from "../domain/configuracionColumnasMatriculas";
import { required, requiredIf } from "shared/i18n-validators";
import { defineComponent, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";

//Components
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";


// Logica y Controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Matricula } from "../domain/Matricula";
import { MatricularController } from "../infraestructure/MatriculaController";
import { useNotificaciones } from "shared/notificaciones";
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { tabOptionsMatriculas } from "config/vehiculos.utils";
import { obtenerFechaActual, obtenerMesMatricula, obtenerPrimerUltimoDiaMes, obtenerUltimoDigito, sumarFechas } from "shared/utils";
import { Vehiculo } from "pages/controlVehiculos/vehiculos/domain/Vehiculo";
import { date } from "quasar";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { acciones, maskFecha } from "config/utils";
import { useVehiculoStore } from "stores/vehiculos/vehiculo";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";

export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup() {
        const mixin = new ContenedorSimpleMixin(Matricula, new MatricularController())
        const { entidad: matricula, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()
        //stores
        const matriculaStore = useVehiculoStore()

        //variables
        const is_month_fecha_matricula = ref(false)
        const is_month_proxima_matricula = ref(false)
        const dataPagoMatricula = {
            matriculador: null,
            observacion: null,
            monto: null,
        }
        const tabActual = ref('1')

        cargarVista(async () => {
            await obtenerListados({
                vehiculos: {
                    controller: new VehiculoController(),
                    params: { campos: 'id,placa,modelo_id' }
                }
            })
        })

        /**************************************************************
         * Validaciones
         **************************************************************/
        const reglas = {
            vehiculo: { required },
            fecha_matricula: { required },
            proxima_matricula: { requiredIf: requiredIf(matricula.fecha_matricula!) },
            matriculador: { requiredIf: requiredIf(matricula.fecha_matricula!) },
        }
        const v$ = useVuelidate(reglas, matricula)
        setValidador(v$.value)

        /*********************************
         * Funciones
        *********************************/
        const { primerDia, ultimoDia } = obtenerPrimerUltimoDiaMes(maskFecha)
        async function filtrarMatriculas(tab: string) {
            tabActual.value = tab
            switch (tab) {
                case '1':// a matricular este mes
                    listar({
                        'fecha_matricula[start]': primerDia,
                        'fecha_matricula[end]': ultimoDia
                    })
                    break
                case '2': //vencidas
                    listar({
                        matriculado: 0,
                        'fecha_matricula[operator]': '<',
                        'fecha_matricula[value]': primerDia,

                    })
                    break
                case '3': //matriculadas
                    listar({ matriculado: 1 })
                    break
                case '4': // a matricular en los proximos meses
                    listar({
                        matriculado: 0,
                        'fecha_matricula[operator]': '>',
                        'fecha_matricula[value]': ultimoDia,
                    })
                    break
                default:
                    listar()
            }
        }
        /**Verifica si es un mes */
        function checkValueFechaMatricula(val, reason, details) {
            is_month_fecha_matricula.value = reason === 'month' ? false : true
        }
        function checkValueProximaMatricula(val, reason, details) {
            is_month_proxima_matricula.value = reason === 'month' ? false : true
        }
        function calcularProximaMatricula() {
            const proxima = obtenerMesMatricula(obtenerUltimoDigito(matricula.placa))
            const fecha1 = new Date()
            const fecha2 = new Date()
            //sumamos un año
            fecha2.setFullYear(fecha2.getFullYear() + 1)
            //seteamos el mes
            fecha1.setMonth(proxima!)
            fecha2.setMonth(proxima!)

            matricula.fecha_matricula = date.formatDate(fecha1, 'MM-YYYY')
            matricula.proxima_matricula = date.formatDate(fecha2, 'MM-YYYY')
        }
        function asignarPlaca() {
            const vehiculoSeleccionado = vehiculos.value.filter((v: Vehiculo) => v.id == matricula.vehiculo)
            matricula.placa = vehiculoSeleccionado[0]['placa']
            calcularProximaMatricula()
        }

        /**************************************************************
         * Botones de tablas
         **************************************************************/
        const btnConsultarMatricula: CustomActionTable = {
            titulo: 'Valores a Pagar',
            icono: 'bi-search',
            color: 'primary',
            tooltip: 'Valores a pagar de matricula',
            accion: () => {
                window.open('https://srienlinea.sri.gob.ec/sri-en-linea/SriVehiculosWeb/ConsultaValoresPagarVehiculo/Consultas/consultaRubros', '_blank')
                /**
                 * Estructura de consulta GET para obtener directamente sobre una placa dada.
                 * https://srienlinea.sri.gob.ec/sri-matriculacion-vehicular-recaudacion-servicio-internet/rest/BaseVehiculo/obtenerPorNumeroPlacaOPorNumeroCampvOPorNumeroCpn?numeroPlacaCampvCpn=HI451V
                 */

            },
            visible: () => { return accion.value == acciones.nuevo || accion.value == acciones.editar }
        }
        const btnConsultarMultas: CustomActionTable = {
            titulo: 'Multas',
            icono: 'bi-file-earmark-text-fill',
            color: 'primary',
            tooltip: 'Consultar multas',
            accion: () => {
                window.open('https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_criterio_consulta.jsp', '_blank')
                /**
                * Estructura de consulta GET para obtener directamente las multas sobre una placa dada.
                * https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=PLA&ps_identificacion=HI451V&ps_placa=
                */

            },
            visible: () => { return accion.value == acciones.nuevo || accion.value == acciones.editar }
        }
        const btnPagarMatricula: CustomActionTable = {
            titulo: ' Pagar',
            icono: 'bi-cash-coin',
            color: 'positive',
            accion: ({ entidad }) => {
                confirmar('¿Está seguro de marcar como pagada la matrícula?', async () => {
                    const data: CustomActionPrompt = {
                        titulo: 'Pagar Matricula ' + entidad.vehiculo,
                        mensaje: 'Persona que realizó la matriculación del vehículo',
                        requerido: true,
                        validacion: (val) => !!val,
                        accion: async (data) => {
                            matriculaStore.idMatricula = entidad.id
                            dataPagoMatricula.matriculador = data
                            const data2: CustomActionPrompt = {
                                titulo: 'Pagar Matricula ' + entidad.vehiculo,
                                mensaje: 'Observación',
                                requerido: true,
                                validacion: (val) => !!val,
                                accion: async (data2) => {
                                    dataPagoMatricula.observacion = data2
                                    const data3: CustomActionPrompt = {
                                        titulo: 'Pagar Matricula ' + entidad.vehiculo,
                                        mensaje: 'Monto del pago',
                                        validacion: (val) => {
                                            const patron = /^(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)?$/
                                            return patron.test(val)
                                        },
                                        accion: async (data) => {
                                            dataPagoMatricula.monto = data
                                            if (await matriculaStore.pagarMatricula(dataPagoMatricula)) {
                                                filtrarMatriculas('3')
                                            }
                                        }
                                    }
                                    prompt(data3)
                                }
                            }
                            prompt(data2)
                        }
                    }
                    prompt(data)
                })
            },
            visible: ({ entidad }) => !entidad.matriculado
        }

        /********************************
         * LISTADOS Y FILTROS
         ********************************/
        const {
            vehiculos, filtrarVehiculos,
        } = useFiltrosListadosSelects(listadosAuxiliares)
        vehiculos.value = listadosAuxiliares.vehiculos

        return {
            mixin, v$, matricula, disabled, accion, acciones,
            configuracionColumnas: configuracionColumnasMatriculas,
            maskFecha: 'MM-YYYY',
            is_month_fecha_matricula, is_month_proxima_matricula,

            //botones de tabla
            btnConsultarMatricula,
            btnConsultarMultas,
            btnPagarMatricula,

            //tab
            tabActual,
            tabOptionsMatriculas,

            //listados
            vehiculos, filtrarVehiculos,

            //funciones
            filtrarMatriculas,
            calcularProximaMatricula,
            checkValueFechaMatricula,
            checkValueProximaMatricula,
            asignarPlaca,

        }



    }
})