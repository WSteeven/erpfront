//Dependencias

import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import ModalEntidad from "components/modales/view/ModalEntidad.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import { Matricula } from "pages/controlVehiculos/matriculacion/domain/Matricula";
import { MatricularController } from "pages/controlVehiculos/matriculacion/infraestructure/MatriculaController";
import { useQuasar } from "quasar";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useCargandoStore } from "stores/cargando";
import { useNotificacionStore } from "stores/notificacion";
import { defineComponent, reactive } from "vue";

// Componentes

//Logica y controladores

export default defineComponent({
    components: {EssentialTable, ModalEntidad},
    setup(props, ctx) {
        const mixin = new ContenedorSimpleMixin(Matricula, new MatricularController())
        const { listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados, cargarVista } = mixin.useComportamiento()
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const cargando = new StatusEssentialLoading()
        
        const reporte = reactive({
          tipo: null,
          fecha_inicio: '',
          fecha_fin: '',
          accion: '',
        })
    

        return {
            reporte,
            
        }
    },
})