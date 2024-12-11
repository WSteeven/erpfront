import { defineComponent, ref, watchEffect } from 'vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { acciones, accionesTabla } from 'config/utils'
import {
  configuracionColumnasFamiliares
} from 'trabajoSocial/composicion_familiar/domain/configuracionColumnasFamiliares'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Familiar } from 'trabajoSocial/composicion_familiar/domain/Familiar'
import { btnEliminarDefault, encontrarUltimoIdListado } from 'shared/utils'

export default defineComponent({
  components: { EssentialTable },
  props: {
    datos: {
      type: Array,
      required: true
    },
    accion:{type:String, default:acciones.nuevo}
  },
  setup(props) {

    const listado = ref()

    watchEffect(() => (listado.value = props.datos))

    const btnAgregarFila: CustomActionTable = {
      titulo: 'Agregar Familiar',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar familiar',
      accion: () => {
        const familiar = new Familiar()
        familiar.id = listado.value?.length
          ? encontrarUltimoIdListado(listado.value) + 1
          : 1
        listado.value.push(familiar)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(props.accion)
    }
    return {
      configuracionColumnasFamiliares,
      accionesTabla,

      //listados
      listado,

      //botones
      btnAgregarFila,
      btnEliminarDefault,

    }
  }
})
