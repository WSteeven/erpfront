import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { TableroPersonalModales } from '../domain/TableroPersonalModales'

export class ComportamientoModalesTableroPersonal extends ComportamientoModales<TableroPersonalModales> {
    constructor() {
        super(new TableroPersonalModales())
    }
}
