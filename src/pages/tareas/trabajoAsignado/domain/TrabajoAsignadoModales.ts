// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import SubtareaAsignadaPage from 'pages/tareas/trabajoAsignado/modules/subtareasAsignadas/view/SubtareaAsignadaPage.vue'
import RecopilacionInformacion from 'pages/tareas/trabajoAsignado/modules/recopilacionInformacion/view/RecopilacionInformacionPage.vue'
import ControlProgresivas from 'pages/tareas/progresivas/controlProgresivas/view/ControlProgresivaPage.vue'
export class TrabajoAsignadoModales {
    SubtareaAsignadaPage: ComponenteModal
    RecopilacionInformacion: ComponenteModal
    ControlProgresivas: ComponenteModal

    constructor() {
        this.SubtareaAsignadaPage = markRaw(
            new ComponenteModal('CONSTRUCRED', SubtareaAsignadaPage)
        ),
            this.RecopilacionInformacion = markRaw(
                new ComponenteModal('CONSTRUCRED', RecopilacionInformacion)
            ),
            this.ControlProgresivas = markRaw(
                new ComponenteModal('CONSTRUCRED', ControlProgresivas)
            )
    }
}
