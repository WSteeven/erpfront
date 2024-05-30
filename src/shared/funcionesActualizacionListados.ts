import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { ConductorController } from "pages/controlVehiculos/conductores/infraestructure/ConductorController"
import { TransaccionSimpleController } from "./contenedor/modules/simple/infraestructure/TransacccionSimpleController"


export async function cargarConsulta(callback: () => Promise<any>): Promise<any> {
    const cargando = new StatusEssentialLoading()
    try {
        cargando.activar()
        const results = await callback()
        return results
    } catch (e) {
        throw e
    } finally {
        cargando.desactivar()
    }
}


export async function recargarGenerico(listadosAuxiliares, name, lista, controller:TransaccionSimpleController<any>) {
    const controlador = controller
    const resultados = await cargarConsulta(controlador.listar.bind(controlador))
    console.log(resultados)
    listadosAuxiliares[name] = resultados.result
    lista.value = resultados.result
    console.log(listadosAuxiliares[name], lista)
}
