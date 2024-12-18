import { computed, defineComponent } from 'vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { configuracionColumnasIngresos } from 'trabajoSocial/economia_familiar/domain/configuracionColumnasIngresos'
import { acciones, accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Ingreso } from 'trabajoSocial/economia_familiar/domain/Ingreso'
import { btnEliminarDefault, encontrarUltimoIdListado } from 'shared/utils'
import { EconomiaFamiliar } from 'trabajoSocial/economia_familiar/domain/EconomiaFamiliar'
import { helpers, minValue, required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'

export default defineComponent({
  components: {
    ErrorComponent,
    EssentialTable,
    OptionGroupComponent
  },
  props: {
    economia_familiar: { type: EconomiaFamiliar, required: true },
    disabled: { type: Boolean, default: false },
    accion: { type: String as keyof acciones, default: acciones.nuevo }
  },
  setup(props) {
    const reglas = {
      ingresos: {
        $each: helpers.forEach({
          nombres_apellidos: { required },
          ocupacion: { required },
          ingreso_mensual: { required, minValue: minValue(1) }
        })
      },
      eg_vivienda: { required, minValue: minValue(0) },
      eg_servicios_basicos: { required, minValue: minValue(0) },
      eg_educacion: { required, minValue: minValue(0) },
      eg_salud: { required, minValue: minValue(0) },
      eg_vestimenta: { required, minValue: minValue(0) },
      eg_alimentacion: { required, minValue: minValue(0) },
      eg_transporte: { required, minValue: minValue(0) },
      eg_prestamos: { required, minValue: minValue(0) },
      eg_otros_gastos: { required, minValue: minValue(0) }
    }
    const v$ = useVuelidate(reglas, props.economia_familiar)

    //aqui se suma el total de ingresos
    // eslint-disable-next-line vue/no-mutating-props
    const total_ingresos = computed(() =>
      props.economia_familiar.ingresos
        .reduce((prev, curr) => prev + parseFloat(curr.ingreso_mensual), 0)
        .toFixed(2)
    )
    // eslint-disable-next-line vue/no-mutating-props
    const total_egresos = computed(
      () =>
        Number(props.economia_familiar.eg_vivienda) +
        Number(props.economia_familiar.eg_servicios_basicos) +
        Number(props.economia_familiar.eg_educacion) +
        Number(props.economia_familiar.eg_salud) +
        Number(props.economia_familiar.eg_vestimenta) +
        Number(props.economia_familiar.eg_alimentacion) +
        Number(props.economia_familiar.eg_transporte) +
        Number(props.economia_familiar.eg_prestamos) +
        Number(props.economia_familiar.eg_otros_gastos)
    )
    // eslint-disable-next-line vue/no-mutating-props
    const total = computed(
      () =>
        Number(total_ingresos.value) -
        Number(total_egresos.value)
    )

    const btnAgregarIngreso: CustomActionTable = {
      titulo: 'Agregar',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar fila',
      accion: () => {
        const ingreso = new Ingreso()
        ingreso.id = props.economia_familiar.ingresos?.length
          ? encontrarUltimoIdListado(props.economia_familiar.ingresos) + 1
          : 1
        // eslint-disable-next-line vue/no-mutating-props
        props.economia_familiar.ingresos.push(ingreso)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(props.accion)
    }

    return {
      acciones,
      accionesTabla,
      configuracionColumnasIngresos,
      v$,
      total_ingresos,
      total_egresos,
      total,
      //botones
      btnAgregarIngreso,
      btnEliminarDefault
    }
  }
})
