import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { GeneralContentModales } from '../domain/GeneralContentModales'

export class ComportamientoModalesGeneralContent extends ComportamientoModales<GeneralContentModales> {
    constructor() {
        super(new GeneralContentModales())
    }
}
