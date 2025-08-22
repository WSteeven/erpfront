import {EntidadAuditable} from 'shared/entidad/domain/entidadAuditable';

export class CuentaBancaria extends EntidadAuditable{
    es_principal:boolean
    banco:string|null
    tipo_cuenta:string|null
    numero_cuenta:string|null
    observacion:string|null

    constructor() {
        super();
        this.es_principal =false
        this.banco = null
        this.tipo_cuenta = null
        this.numero_cuenta = null
        this.observacion = null



    }
}