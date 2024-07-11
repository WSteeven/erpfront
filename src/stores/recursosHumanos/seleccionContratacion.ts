import { SolicitudPuestoEmpleo } from "pages/recursosHumanos/SeleccionContratacionPersonal/solicitudPuestoTrabajo/domain/SolicitudPuestoEmpleo";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSeleccionContratacionStore = defineStore('seleccionContratacion', () => {
    const solicitudPersonal = reactive(new SolicitudPuestoEmpleo())
    const idSolicitudVacante = ref()
    const solicitudPersonalReset = new SolicitudPuestoEmpleo()

    return {
        idSolicitudVacante,
        solicitudPersonal,
        solicitudPersonalReset,
        
    }
})