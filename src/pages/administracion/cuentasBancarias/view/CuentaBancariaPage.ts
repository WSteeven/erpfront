import { defineComponent } from 'vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { CuentaBancaria } from 'pages/administracion/cuentasBancarias/domain/CuentaBancaria'
import { CuentaBancariaController } from 'pages/administracion/cuentasBancarias/infraestructure/CuentaBancariaController'
import { BancoController } from 'recursosHumanos/banco/infrestruture/BancoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { configuracionColumnasCuentasBancarias } from 'pages/administracion/cuentasBancarias/domain/ConfiguracionColumnasCuentasBancarias'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { SelectOption } from 'components/tables/domain/SelectOption'
import { ordenarLista } from 'shared/utils'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

export default defineComponent({
  components: { TabLayout, ErrorComponent, NoOptionComponent },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      CuentaBancaria,
      new CuentaBancariaController()
    )
    const {
      entidad: cuenta,
      accion,
      listadosAuxiliares,
      disabled
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const { onGuardado, onModificado } =
      mixin.useHooks()

    const tiposCuentas: SelectOption[] = [
      { label: 'Corriente', value: 'CTE' },
      { label: 'Ahorros', value: 'AHO' },
      { label: 'Plazo Fijo', value: 'PLA' },
      { label: 'Inversion', value: 'INV' }
      // {label: 'Tarjeta de Credito', value: 'TDC'},
      // {label: 'Tarjeta de Debito', value: 'TDD'}
    ]
    const { bancos, filtrarBancos } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        bancos: new BancoController()
      })

      bancos.value = listadosAuxiliares.bancos
    })

    const reglas = {
      tipo_cuenta: { required },
      numero_cuenta: { required },
      banco: { required }
    }
    const v$ = useVuelidate(reglas, cuenta)
    setValidador(v$.value)

    /****************
     * HOOKS
     ****************/
    onGuardado(async () => await listar())
    onModificado(async () => await listar())

    return {
      mixin,
      v$,
      cuenta,
      accion,
      disabled,
      configuracionColumnas: configuracionColumnasCuentasBancarias,

      bancos,
      filtrarBancos,
      ordenarLista,
      tiposCuentas
    }
  }
})
