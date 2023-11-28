import { Validador } from "shared/validadores/domain/Validador";
import { PreingresoMaterial } from "../../domain/PreingresoMaterial";

export class ValidarListadoProductos implements Validador {
    private preingreso: PreingresoMaterial

    constructor(preingreso: PreingresoMaterial) {
        this.preingreso = preingreso
    }

    /*Validaciones */
    async validar(): Promise<boolean> {
        if (this.preingreso.listadoProductos.length == 0) throw new Error('Debe agregar al menos un item al listado')

        this.preingreso.listadoProductos.every((item) => {
            console.log(item)
        })
        if (this.preingreso.listadoProductos.some((item) => item.fotografia == null || item.fotografia == undefined)) throw new Error('Debe ingresar una fotografía en cada elemento del listado')

        return true
    }

}