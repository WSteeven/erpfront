import { defineStore } from 'pinia'
import { ConfiguracionGeneral } from 'sistema/configuracion/domain/Configuracion'
import { ConfiguracionGeneralController } from 'sistema/configuracion/infraestructure/ConfiguracionController'
import { Ref, ref } from 'vue'

export const useConfiguracionGeneralStore = defineStore('configuracion_general', () => {
  // State
  const configuracion: Ref<ConfiguracionGeneral | undefined> = ref()

  function consultarConfiguracion() {
    // const configuracionAuxiliar = new ConfiguracionGeneral()
    const controlador = new ConfiguracionGeneralController()
    controlador.listar().then((response: any) => configuracion.value = response.result[0])
    // controlador.consultar(1).then((response: any) => configuracion.value = response.result)
    // configuracion.value = configuracionAuxiliar
  }

  function refrescarConfiguracion() {
    consultarConfiguracion()
  }

  return {
    configuracion,
    consultarConfiguracion,
    refrescarConfiguracion,
  }
})
