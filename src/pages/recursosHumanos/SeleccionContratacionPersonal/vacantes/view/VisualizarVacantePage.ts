// Dependencies
import { defineComponent } from 'vue';
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante';

// Components
import VisorImagen from 'components/VisorImagen.vue';
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue';

// Logic & controllers


export default defineComponent({
  components: { BasicContainer, VisorImagen },
  setup() {

    const vacanteStore = useVacanteStore()

    if (vacanteStore.idVacante !== null || vacanteStore.idVacante !== undefined) {
      vacanteStore.showPreview();
    }



    return {
      vacante: vacanteStore.vacante,
    }
  }
})
