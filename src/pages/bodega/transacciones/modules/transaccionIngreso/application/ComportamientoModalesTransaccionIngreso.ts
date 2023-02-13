import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TransaccionEgresoModales } from '../domain/TransaccionIngresoModales'

export class ComportamientoModalesTransaccionIngreso extends ComportamientoModales<TransaccionEgresoModales>{
    constructor() {
        super(new TransaccionEgresoModales)
    }
}