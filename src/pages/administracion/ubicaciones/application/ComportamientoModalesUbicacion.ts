import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { UbicacionModales } from '../domain/UbicacionModales'

export class ComportamientoModalesUbicacion extends ComportamientoModales<UbicacionModales>{
    constructor() {
        super(new UbicacionModales())
    }
}