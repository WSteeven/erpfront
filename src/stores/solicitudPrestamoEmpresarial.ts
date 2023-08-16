import { SolicitudPrestamo } from "pages/recursosHumanos/solicitudes/solicitud-prestamo/domain/SolicitudPrestamo";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSolicitudPrestamoEmpresarialStore = defineStore('pedido', () => {
  const solicitudPrestamo = reactive(new SolicitudPrestamo())
  const solicitudPrestamoReset = new SolicitudPrestamo()
  const idsolicitudPrestamo = ref()
  return {
    solicitudPrestamo,
    idsolicitudPrestamo
  }

})
