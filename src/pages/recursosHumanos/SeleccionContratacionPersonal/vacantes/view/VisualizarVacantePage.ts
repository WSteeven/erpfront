// Dependencies
import { defineComponent } from 'vue';
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante';
import relativeTime from 'dayjs/plugin/relativeTime';
import es from 'dayjs/locale/es';
import dayjs from 'dayjs'


// Components
import VisorImagen from 'components/VisorImagen.vue';
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue';

// Logic & controllers


export default defineComponent({
  components: { BasicContainer, VisorImagen },
  setup() {

    dayjs.extend(relativeTime)
    dayjs.locale(es)
    const vacanteStore = useVacanteStore()

    if (vacanteStore.idVacante !== null || vacanteStore.idVacante !== undefined) {
      vacanteStore.showPreview();
    }


    function agregarAFavoritos(id: number) {
      console.log('Diste clic en agregar a favoritos', id)
    }
    return {
      vacante: vacanteStore.vacante,
      dayjs,

      agregarAFavoritos,
    }
  }
})
