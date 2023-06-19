//Dependencias
import { markRaw } from 'vue';
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";

//Paginas
import VisualizarIngresoPage from '../view/VisualizarIngresoPage.vue';

export class GestionarIngresoModales{
  VisualizarIngresoPage: ComponenteModal

  constructor(){
    this.VisualizarIngresoPage = markRaw(new ComponenteModal("Ingreso de bodega", VisualizarIngresoPage))
  }
}
