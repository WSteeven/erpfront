import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { GestionarIngresoModales } from '../domain/TransaccionIngresoModales'

export class ComportamientoModalesTransaccionIngreso extends ComportamientoModales<GestionarIngresoModales>{
    constructor() {
        super(new GestionarIngresoModales())
    }
}
