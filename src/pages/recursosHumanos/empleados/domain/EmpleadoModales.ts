// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//Paginas
import EmpleadoPage from '../view/EmpleadoPage.vue';
import EmpleadoInfoPage from '../view/EmpleadoInfoPage.vue';
import FamiliaresPage from 'pages/recursosHumanos/familiares/view/FamiliaresPage.vue';
export class EmpleadoModales {
    EmpleadoPage: ComponenteModal
    EmpleadoInfoPage: ComponenteModal
    FamiliaresPage: ComponenteModal

    constructor() {
        this.EmpleadoPage = markRaw(new ComponenteModal('Empleado', EmpleadoPage))
        this.EmpleadoInfoPage = markRaw(new ComponenteModal('Información de empleado', EmpleadoInfoPage))
        this.FamiliaresPage = markRaw(new ComponenteModal('Familiares', FamiliaresPage))
    }
}
