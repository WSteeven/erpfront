/**
 * @author Wilson Cordova
 * @description Este store sirve para almacenar el id de userExternal que servirá para dar de alta como empleado en el sistema.
 */
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePostulanteStore = defineStore('postulante', () => {
  const idUser = ref()
  return {
    idUser
  }
})
