// Dependencies
import { configuracionColumnasMatriculas } from "../domain/configuracionColumnasMatriculas";
import { required, requiredIf } from "shared/i18n-validators";
import { defineComponent, reactive, ref } from "vue";

//Components
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";


// Logica y Controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Matricula } from "../domain/Matricula";
import { MatricularController } from "../infraestructure/MatriculaController";
import { useNotificaciones } from "shared/notificaciones";
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import useVuelidate from "@vuelidate/core";
import { tabOptionsMatriculas } from "config/vehiculos.utils";
import { obtenerFechaActual, obtenerMesMatricula, obtenerPrimerUltimoDiaMes, obtenerUltimoDigito, sumarFechas } from "shared/utils";
import { Vehiculo } from "pages/controlVehiculos/vehiculos/domain/Vehiculo";
import { date } from "quasar";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { acciones } from "config/utils";
import { RouterLink, useRouter } from "vue-router";
import router from "src/router";
import { useVehiculoStore } from "stores/vehiculos/vehiculo";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { data } from "autoprefixer";

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
        const is_month = ref(false)
        const dataPagoMatricula = {
            matriculador: null,
            observacion: null,
            monto: null,
        }

        cargarVista(async () => {
            await obtenerListados({
                vehiculos: {
                    controller: new VehiculoController(),
                    params: { campos: 'id,placa,marca,modelo' }
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
        const { primerDia, ultimoDia } = obtenerPrimerUltimoDiaMes('YYYY-MM-DD')
        async function filtrarMatriculas(tab: string) {
            switch (tab) {
                case '1':
                    listar({
                        'fecha_matricula[start]': primerDia,
                        'fecha_matricula[end]': ultimoDia
                    })
                    break
                case '2':
                    listar({
                        matriculado: 0,
                        'fecha_matricula[operator]': '<',
                        'fecha_matricula[value]': sumarFechas(obtenerFechaActual(), 0, 0, 0, 'YYYY-MM-DD'),

                    })
                    break
                case '3':
                    listar({ matriculado: 1 })
                    break
                default:
                    listar()
            }
        }
        /**Verifica si es un mes */
        function checkValue(val, reason, details) {
            is_month.value = reason === 'month' ? false : true
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
                                requerido: false,
                                accion: async (data2) => {
                                    dataPagoMatricula.observacion = data2
                                    const data3: CustomActionPrompt = {
                                        titulo: 'Pagar Matricula ' + entidad.vehiculo,
                                        mensaje: 'Monto del pago',
                                        tipo: 'number',
                                        requerido: false,
                                        accion: async (data) => {
                                            dataPagoMatricula.monto = data
                                            matriculaStore.pagarMatricula(dataPagoMatricula)
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
            mixin, v$, matricula, disabled, accion,
            configuracionColumnas: configuracionColumnasMatriculas,
            maskFecha: 'MM-YYYY',

            //botones de tabla
            btnConsultarMatricula,
            btnConsultarMultas,
            btnPagarMatricula,

            //tab
            tabOptionsMatriculas,

            //listados
            vehiculos, filtrarVehiculos,

            //funciones
            filtrarMatriculas,
            calcularProximaMatricula,
            checkValue,
            asignarPlaca,

        }



    }
})