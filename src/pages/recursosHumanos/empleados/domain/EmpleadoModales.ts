// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//Paginas
import EmpleadoPage from '../view/EmpleadoPage.vue';
import EmpleadoInfoPage from '../view/EmpleadoInfoPage.vue';
import FamiliaresPage from 'pages/recursosHumanos/familiares/view/FamiliaresPage.vue';
import PlanVacacionIndividualPage from 'recursosHumanos/planVacacion/view/PlanVacacionIndividualPage.vue'
import ReasignarSubordinadosPage
    from 'recursosHumanos/empleados/modules/reasignarSubordinados/view/ReasignarSubordinadosPage.vue';
import DesvincularEmpleadoPage
    from 'recursosHumanos/empleados/modules/desvincularEmpleado/view/DesvincularEmpleadoPage.vue';


export class EmpleadoModales {
    EmpleadoPage: ComponenteModal
    EmpleadoInfoPage: ComponenteModal
    FamiliaresPage: ComponenteModal
    PlanVacacionIndividualPage: ComponenteModal
    ReasignarSubordinadosPage: ComponenteModal
    DesvincularEmpleadoPage:ComponenteModal

    constructor() {
        this.EmpleadoPage = markRaw(new ComponenteModal('Empleado', EmpleadoPage))
        this.EmpleadoInfoPage = markRaw(new ComponenteModal('Información de empleado', EmpleadoInfoPage))
        this.FamiliaresPage = markRaw(new ComponenteModal('Familiares', FamiliaresPage))
        this.PlanVacacionIndividualPage = markRaw(new ComponenteModal('Plan de Vacaciones', PlanVacacionIndividualPage))
        this.ReasignarSubordinadosPage = markRaw(new ComponenteModal('Reasignar Subordinados', ReasignarSubordinadosPage))
        this.DesvincularEmpleadoPage = markRaw(new ComponenteModal('Desvincular Empleado', DesvincularEmpleadoPage))
    }
}
