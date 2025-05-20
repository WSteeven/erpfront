import { defineComponent } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Progresiva } from 'pages/appenate/telconet/progresivas/domain/Progresiva'
import { ProgresivaController } from 'pages/appenate/telconet/progresivas/infraestructure/ProgresivaController'
import { configuracionColumnasProgresivas } from 'pages/appenate/telconet/progresivas/domain/configuracionColumnasProgresivas'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import ErrorComponent from 'components/ErrorComponent.vue';

export default defineComponent({
  components: { ErrorComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Progresiva,
      new ProgresivaController()
    )
    const {
      entidad: progresiva,
      listadosAuxiliares,
      accion,
      disabled
    } = mixin.useReferencias()

    const btnImprimirOT: CustomActionTable = {
      titulo: 'Imprimir OT',
      icono: 'bi-file-earmark-excel-fill',
      color: 'positive',
      accion: () => {
        console.log('Aqui se imprime la OT')
      },
      visible: () => true
    }
    const btnImprimirKML: CustomActionTable = {
      titulo: 'Imprimir KML',
      icono: 'bi-filetype-xml',
      color: 'grey',
      accion: () => {
        console.log('Aqui se imprime el kml con las coordenadas')
      },
      visible: () => true
    }

    return {
      mixin,
      progresiva,
      accion,
      disabled,
      configuracionColumnas: configuracionColumnasProgresivas,

      //botones de tabla
      btnImprimirOT,
      btnImprimirKML
    }
  }
})
