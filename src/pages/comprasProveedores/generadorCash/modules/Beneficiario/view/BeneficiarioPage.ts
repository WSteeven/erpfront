// Dependencias
import { configuracionColumnasCuentaBancaria } from '../domain/configuracionColumnasCuentaBancaria'
import { configuracionColumnasBeneficiarios } from '../domain/configuracionColumnasBeneficiarios'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { mapearOptionsSelect, ordenarLista } from 'shared/utils'
import { helpers, required } from 'shared/i18n-validators'
import { defineComponent, UnwrapRef } from 'vue'
import useVuelidate from '@vuelidate/core'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CuentaBancaria } from 'pages/comprasProveedores/generadorCash/domain/CuentaBancaria'
import { BancoController } from 'pages/recursosHumanos/banco/infrestruture/BancoController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { tiposDocumentosIdentificacionesCash } from 'config/utils_compras_proveedores'
import { BeneficiarioController } from '../infraestructure/BeneficiarioController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { Beneficiario } from '../domain/Beneficiario'
import { accionesTabla } from 'config/utils'

export default defineComponent({
  components: { TabLayout, EssentialTable },
  props: {
    datos: Object as () => UnwrapRef<{ identificacion_beneficiario: string, codigo_beneficiario: string }>,
  },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(Beneficiario, new BeneficiarioController())
    const { entidad: beneficiario, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onReestablecer, onGuardado } = mixin.useHooks()

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
      identificacion_beneficiario: { required },
      nombre_beneficiario: { required },
      cuentas_bancarias: {
        $each: helpers.forEach({
          tipo_cuenta: { required },
          numero_cuenta: { required },
          banco: { required },
        })
      },
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, beneficiario)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onReestablecer(() => emit('cerrar-modal'))

    onGuardado(() => emit('guardado'))

    /********
     * Init
     ********/
    beneficiario.cuentas_bancarias.unshift(new CuentaBancaria())
    beneficiario.identificacion_beneficiario = props.datos?.identificacion_beneficiario ?? null
    beneficiario.codigo_beneficiario = props.datos?.identificacion_beneficiario ?? null

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