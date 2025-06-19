import { Validador } from 'shared/validadores/domain/Validador';
import { Transferencia } from '../../domain/Transferencia';

export class ValidarListadoProductos implements Validador {
    private transferencia: Transferencia

    constructor(transferencia: Transferencia) {
        this.transferencia = transferencia;
    }

    /**
     * Validar que el listado no esté vacío
     */
    async validar(): Promise<boolean> {
        if (this.transferencia.listadoProductos.includes((v) => v.cantidades <= 0 || v.cantidades == null)) throw new Error('Debe ingresar una cantidad')
        return true
    }
}