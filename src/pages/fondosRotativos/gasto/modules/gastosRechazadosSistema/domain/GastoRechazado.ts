import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'

export class GastoRechazado extends Gasto{
    motivo: string|null;
    activador: number|null;

    constructor() {
        super()
        this.motivo = null
        this.activador = null

    }
}
