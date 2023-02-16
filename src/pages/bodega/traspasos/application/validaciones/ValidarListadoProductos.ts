import { Validador } from "shared/validadores/domain/Validador";
import { Traspaso } from "../../domain/Traspaso";

export class ValidarListadoProductos implements Validador{
    private traspaso:Traspaso

    constructor(traspaso:Traspaso){
        this.traspaso = traspaso
    }

    /**
     * Validar que el listado no esté vacío
     */
    async validar(): Promise<boolean> {
        if(this.traspaso.listadoProductos.length===0){
            throw new Error('Debe agregar al menos un producto al listado.')
        }
        return true
    }
}