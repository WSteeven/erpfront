import { defineStore } from "pinia";
import { reactive } from "vue";
import { Notificacion } from 'pages/notificacion/domain/Notificacion'
export const useNotificacionStore = defineStore('notificacion', () => {
  const notificacion = reactive(new Notificacion());
  return notificacion;

});
