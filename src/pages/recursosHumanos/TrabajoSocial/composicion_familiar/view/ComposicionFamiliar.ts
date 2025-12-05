import { defineComponent, ref, watchEffect } from 'vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { acciones, accionesTabla } from 'config/utils'
import { configuracionColumnasFamiliares } from 'trabajoSocial/composicion_familiar/domain/configuracionColumnasFamiliares'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Familiar } from 'trabajoSocial/composicion_familiar/domain/Familiar'
import { btnEliminarDefault, encontrarUltimoIdListado } from 'shared/utils'
import { parentescos } from 'config/trabajoSocial.utils'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { EstadoCivilController } from 'recursosHumanos/estado-civil/infraestructure/EstadoCivilController'
import {EstadoCivil} from 'recursosHumanos/estado-civil/domain/EstadoCivil';

export default defineComponent({
  components: { EssentialTable },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: true
    },
    datos: {
      type: Array,
      required: true
    },
    accion: { type: typeof acciones, default: acciones.nuevo }
  },
  setup(props,{}) {
    const { listadosAuxiliares } = props.mixin.useReferencias()
    const { cargarVista, obtenerListados } = props.mixin.useComportamiento()
    const listado = ref()
    // const configuracionColumnas = ref(configuracionColumnasFamiliares)
    cargarVista(async () => {
      await obtenerListados({
        estados_civiles: new EstadoCivilController()
      })

      // configuracion de columnas
      configuracionColumnasFamiliares.find(
      // configuracionColumnas.value.find(
        item => item.field === 'estado_civil'
      )!.options = listadosAuxiliares.estados_civiles.map((v:EstadoCivil) => {
        return { label: v.nombre, value: v.nombre }
      })
    })
    // configuracion de columnas
    // configuracionColumnas.value.find(
    configuracionColumnasFamiliares.find(
      item => item.field === 'parentesco'
    )!.options = parentescos.map(v => {
      return { label: v.nombre, value: v.value }
    })

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
        familiar.discapacidad=0
        familiar.ingreso_mensual=0
        listado.value.push(familiar)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(props.accion)
    }
    return {
      configuracionColumnas: configuracionColumnasFamiliares,
      accionesTabla,
      acciones,
      //listados
      listado,

      //botones
      btnAgregarFila,
      btnEliminarDefault
    }
  }
})
