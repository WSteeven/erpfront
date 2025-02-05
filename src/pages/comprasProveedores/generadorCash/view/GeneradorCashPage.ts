// Dependencias
import { configuracionColumnasCuentaBancariaSelectable } from '../modules/Beneficiario/domain/configuracionColumnasCuentaBancariaSelectable'
import { configuracionColumnasBeneficiarios } from '../modules/Beneficiario/domain/configuracionColumnasBeneficiarios'
import { configuracionColumnasGeneradorCash } from '../domain/configuracionColumnasGeneradorCash'
import { configuracionColumnasPago } from '../domain/configuracionColumnasPago'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { minValue, required } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, Ref, ref, watch } from 'vue'
import { helpers } from '@vuelidate/validators'
import { accionesTabla } from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'
import _ from 'lodash'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { useOrquestadorSelectorCuentasBancariasBeneficiario } from '../application/OrquestadorSelectorCuentasBancariasBeneficiario'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGeneradorCash } from '../application/ComportamientoModalesGeneradorCash'
import { useOrquestadorSelectorBeneficiarios } from '../application/OrquestadorSelectorBeneficiarios'
import { GeneradorCashController } from '../infraestructure/GeneradorCashController'
import { GeneradorCash } from '../domain/GeneradorCash'
import { Pago } from '../domain/Pago'

export default defineComponent({
    components: { TabLayout, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    setup() {
        /**********
         * Stores
         **********/
        const notificacionStore = useNotificacionStore()
        notificacionStore.setQuasar(useQuasar())

        /********
         * Mixin
         ********/
        const mixin = new ContenedorSimpleMixin(GeneradorCash, new GeneradorCashController())
        const { entidad: generador } = mixin.useReferencias()
        const { listar: listarGeneradorCash, setValidador } = mixin.useComportamiento()
        const { onBeforeGuardar, onReestablecer } = mixin.useHooks()

        /************
         * Variables
         ************/
        let rowIndex: Ref<number> = ref(-1)
        const pago = new Pago()
        pago.tipo = 'PA'
        pago.num_cuenta_empresa = '02653010903'
        pago.num_secuencial = 1
        pago.moneda = 'USD'
        pago.forma_pago = 'CTA'
        const { notificarAdvertencia, confirmar } = useNotificaciones()

        /************
         * Funciones
         ************/
        const consultarBeneficiario = (fila: Pago, index: number) => {
            rowIndex.value = index
            criterioBusqueda.value = fila.identificacion_beneficiario
            listar()
        }

        const consultarCuentasBancarias = (fila: Pago, index: number) => {
            rowIndex.value = index
            if (!fila.beneficiario_id) return notificarAdvertencia('Primero seleccione un beneficiario.')
            criterioBusquedaCuentasBancarias.value = fila.numero_cuenta
            listarCuentasBancarias({ beneficiario_id: fila.beneficiario_id })
        }

        /****************
         * Botones tabla
        ****************/
        const btnAgregarPago: CustomActionTable<Pago> = {
            titulo: 'Agregar pago',
            icono: 'bi-plus',
            accion: () => generador.pagos = [_.cloneDeep(pago), ...generador.pagos]
        }

        const btnGestionarBeneficiarios: CustomActionTable = {
            titulo: 'Gestionar beneficiarios',
            icono: 'bi-people',
            color: 'positive',
            accion: () => modales.abrirModalEntidad('BeneficiarioPage')
        }

        const btnGenerarCash: CustomActionTable<Pago> = {
            titulo: 'Generar cash',
            icono: 'bi-table',
            color: 'positive',
            accion: ({ entidad }) => listarGeneradorCash({ export: 'xlsx', titulo: `cash_${entidad.id}_${entidad.created_at}`, id: entidad.id })
        }

        const btnEliminarPago = ({ posicion }) => confirmar('Esta operación es irreversible. ¿Desea continuar?', () => generador.pagos.splice(posicion, 1))

        /***************
         * Orquestador
         ***************/
        const {
            refListadoSeleccionable,
            criterioBusqueda,
            listado,
            listar,
            seleccionar,
            existenCoincidencias,
        } = useOrquestadorSelectorBeneficiarios(generador, 'beneficiarios', rowIndex)

        const {
            refListadoSeleccionable: refListadoSeleccionableCuentasBancarias,
            criterioBusqueda: criterioBusquedaCuentasBancarias,
            listado: listadoCuentasBancarias,
            listar: listarCuentasBancarias,
            seleccionar: seleccionarCuentasBancarias,
            existenCoincidencias: existenCoincidenciasCuentasBancarias,
        } = useOrquestadorSelectorCuentasBancariasBeneficiario(generador, 'cuentas_bancarias', rowIndex)

        /**********
         * Modales
        **********/
        const modales = new ComportamientoModalesGeneradorCash()

        /************
         * Observers
        ************/
        watch(existenCoincidencias, (existe) => { // Agregar identificacion automaticamente 
            if (!existe) modales.abrirModalEntidad('BeneficiarioPage', { identificacion_beneficiario: generador.pagos[rowIndex.value].identificacion_beneficiario })
        })

        /********
         * Hooks
         ********/
        onBeforeGuardar(() => {
            generador.pagos.map((pago, index) => {
                pago.num_secuencial = index + 1
                return pago
            })
        })

        onReestablecer(() => generador.pagos = [_.cloneDeep(pago)])

        /*********
         * Reglas
         *********/
        const rules = {
            titulo: { required },
            pagos: {
                $each: helpers.forEach({
                    identificacion_beneficiario: { required },
                    numero_cuenta: { required },
                    referencia: { required },
                    valor: { required, minValue: minValue(0) }
                })
            },
        }

        // Inicializamos Vuelidate
        const v$ = useVuelidate(rules, generador)
        setValidador(v$.value)

        /*******
         * Init
        *******/
        configuracionColumnasPago.find((c: ColumnConfig<Pago>) => c.field === 'identificacion_beneficiario')!!.accion = consultarBeneficiario
        configuracionColumnasPago.find((c: ColumnConfig<Pago>) => c.field === 'numero_cuenta')!!.accion = consultarCuentasBancarias
        generador.pagos.unshift(_.cloneDeep(pago))

        return {
            v$,
            mixin,
            generador,
            configuracionColumnasGeneradorCash,
            configuracionColumnasPagoAccion: [...configuracionColumnasPago, accionesTabla],
            configuracionColumnasCuentaBancariaSelectable,
            configuracionColumnasBeneficiarios,
            btnAgregarPago,
            btnGenerarCash,
            refListadoSeleccionable,
            listado,
            seleccionar,
            existenCoincidencias,
            modales,
            btnEliminarPago,
            btnGestionarBeneficiarios,
            // orquestador
            refListadoSeleccionableCuentasBancarias,
            criterioBusquedaCuentasBancarias,
            listadoCuentasBancarias,
            listarCuentasBancarias,
            seleccionarCuentasBancarias,
            existenCoincidenciasCuentasBancarias,
            listar,
        }
    }
})