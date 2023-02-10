import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { ModeloModales } from '../domain/ModeloModales'

export class ComportamientoModalesModelos extends ComportamientoModales<ModeloModales>{
    constructor() {
        super(new ModeloModales())
    }
}