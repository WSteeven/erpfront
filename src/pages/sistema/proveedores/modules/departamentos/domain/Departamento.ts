import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Departamento extends EntidadAuditable {
    nombre: string | null

    constructor() {
        super()
        this.nombre = null
    }
}