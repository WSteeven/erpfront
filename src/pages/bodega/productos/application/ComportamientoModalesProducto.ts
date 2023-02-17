import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { ProductoModales } from '../domain/ProductoModales'

export class ComportamientoModalesProducto extends ComportamientoModales<ProductoModales>{
    constructor() {
        super(new ProductoModales())
    }
}
