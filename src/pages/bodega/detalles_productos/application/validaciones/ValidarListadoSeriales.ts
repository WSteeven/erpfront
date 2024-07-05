import { Validador } from 'shared/validadores/domain/Validador';
import { DetalleProducto } from '../../domain/DetalleProducto';
import { tieneElementosRepetidosObjeto } from 'shared/utils';

export class ValidarListadoSeriales implements Validador {
    private detalle: DetalleProducto

    constructor(detalle: DetalleProducto) {
        this.detalle = detalle;
    }

    /**
     * Validar que el listado no esté vacío ni tenga numeros de serie repetidos
     */
    async validar(): Promise<boolean> {
        if (this.detalle.seriales.length === 0 && this.detalle.varios_items)
            throw new Error('Debe agregar al menos un serial o desactiva el check de "varios items" ')
        if (tieneElementosRepetidosObjeto(this.detalle.seriales)) throw new Error('Tienes numeros de series repetidos, por favor verifica que estos sean diferentes')
        return true
    }
}