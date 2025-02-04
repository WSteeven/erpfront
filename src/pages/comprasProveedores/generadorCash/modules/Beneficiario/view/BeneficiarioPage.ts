// Dependencias
import { configuracionColumnasCuentaBancaria } from '../domain/configuracionColumnasCuentaBancaria'
import { configuracionColumnasBeneficiarios } from '../domain/configuracionColumnasBeneficiarios'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { mapearOptionsSelect, ordenarLista } from 'shared/utils'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CuentaBancaria } from 'pages/comprasProveedores/generadorCash/domain/CuentaBancaria'
import { BancoController } from 'pages/recursosHumanos/banco/infrestruture/BancoController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { BeneficiarioController } from '../infraestructure/BeneficiarioController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Beneficiario } from '../domain/Beneficiario'
import { tiposDocumentosIdentificacionesCash } from 'config/utils_compras_proveedores'
import { useNotificaciones } from 'shared/notificaciones'
import { accionesTabla } from 'config/utils'

export default defineComponent({
  components: { TabLayout, EssentialTable },
  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(Beneficiario, new BeneficiarioController())
    const { entidad: beneficiario, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        bancos: new BancoController(),
        cantones: new CantonController(),
      })
      configuracionColumnasCuentaBancaria.find((c: ColumnConfig<CuentaBancaria>) => c.field === 'banco')!!.options = mapearOptionsSelect(listadosAuxiliares.bancos)
    })

    /*************
     * Variables
     *************/
    const { confirmar } = useNotificaciones()

    /*************
     * Funciones
     *************/
    const { cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)

    /****************
     * Botones tabla
    ****************/
    const btnAgregarCuentaBancaria: CustomActionTable<CuentaBancaria> = {
      titulo: 'Agregar cuenta bancaria',
      icono: 'bi-plus',
      accion: () => beneficiario.cuentas_bancarias.unshift(new CuentaBancaria())
    }

    const btnEliminarCuentaBancaria = ({ posicion }) => confirmar('Esta operación es irreversible. ¿Desea continuar?', () => beneficiario.cuentas_bancarias.splice(posicion, 1))

    /*********
     * Reglas
     *********/
    const rules = {
      codigo_beneficiario: { required },
      tipo_documento: { required },
      identificacion_beneficiario: { required },// pedido - editar
      nombre_beneficiario: { required },
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, beneficiario)
    setValidador(v$.value)

    /********
     * Init
     ********/
    beneficiario.cuentas_bancarias.unshift(new CuentaBancaria())

    return {
      v$,
      mixin,
      beneficiario,
      disabled,
      tiposDocumentosIdentificacionesCash,
      configuracionColumnasBeneficiarios,
      btnAgregarCuentaBancaria,
      configuracionColumnasCuentaBancariaAccion: [...configuracionColumnasCuentaBancaria, accionesTabla],
      cantones,
      filtrarCantones,
      ordenarLista,
      btnEliminarCuentaBancaria,
    }
  }
})