import { defineStore } from 'pinia'
import { ConfiguracionGeneral } from 'sistema/configuracion/domain/Configuracion'
import { ConfiguracionGeneralController } from 'sistema/configuracion/infraestructure/ConfiguracionController'
import { Ref, ref } from 'vue'

export const useConfiguracionGeneralStore = defineStore('configuracion_general', () => {
  // State
  const configuracion: Ref<ConfiguracionGeneral | undefined> = ref()

  async function consultarConfiguracion() {
    const controlador = new ConfiguracionGeneralController()
    await controlador.listar().then((response: any) => configuracion.value = response.result[0])
  }

  function refrescarConfiguracion() {
    consultarConfiguracion()
  }

  function cambiarFavicon() {
    const rutaImagen = configuracion.value?.logo_claro
    console.log(rutaImagen)

    if (rutaImagen) {
      const link: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = rutaImagen;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }

  return {
    configuracion,
    consultarConfiguracion,
    refrescarConfiguracion,
    cambiarFavicon,
  }
})
