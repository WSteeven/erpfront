// Dependencias
import {computed, UnwrapRef, watch} from "vue"
import {PAIS_DEFECTO} from "@/@config/utils.config"
// Logica y Controladores
import {PaisController} from "@/@app/sistema/pais/infraestructure/pais.controller"
import {CiudadController} from "@/@app/sistema/ciudad/infraestructure/ciudad.controller"
import {ProvinciaController} from "@/@app/sistema/provincia/infraestructure/provincia.controller"
import {ConfiguracionUbicable} from "@shared/ubicacion/domain/ubicable.domain"

export class ComportamientoUbicacion {
  private listadosAuxiliares: UnwrapRef<any>
  private entidad: ConfiguracionUbicable

  private provinciaController = new ProvinciaController()
  private ciudadController = new CiudadController()
  private paisController = new PaisController()

  constructor(entidad: ConfiguracionUbicable, listadosAuxiliares: any[]) {
    this.entidad = entidad
    this.listadosAuxiliares = listadosAuxiliares

    watch(
      computed(() => this.entidad.provincia),
      () => {
        if (this.entidad.provincia) this.obtenerCiudades(this.entidad.provincia)
      }
    )
  }

  async establecerUbicacionDefecto(paisDef = PAIS_DEFECTO): Promise<void> {
    await this.obtenerPaises()
    await this.obtenerProvincias(paisDef)
    /* if (this.entidad.provincia)
      await this.obtenerCiudades(this.entidad.provincia) */
    /* const provincia = computed(() => this.entidad.provincia)
    watch(provincia, async () => {
      if (provincia.value) await this.obtenerCiudades(provincia.value)
    }) */
  }

  obtenerPaises = async (): Promise<void> => {
    const {result} = await this.paisController.listar()
    this.listadosAuxiliares.paisListado.push(...result)
  }

  obtenerProvincias = async (pais: number): Promise<void> => {
    const {result} = await this.provinciaController.listar({
      pais: pais,
    })
    const longitud = await this.listadosAuxiliares.provinciaListado.length
    await this.listadosAuxiliares.provinciaListado.splice(
      0,
      longitud,
      ...result
    )
  }

  obtenerCiudades = async (provincia: number): Promise<void> => {
    const {result} = await this.ciudadController.listar({
      provincia: provincia,
    })
    const longitud = this.listadosAuxiliares.ciudadListado.length
    this.listadosAuxiliares.ciudadListado.splice(0, longitud, ...result)
  }
}
