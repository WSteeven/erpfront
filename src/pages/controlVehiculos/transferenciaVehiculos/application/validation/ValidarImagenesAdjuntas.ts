import { Validador } from "shared/validadores/domain/Validador"
import { TransferenciaVehiculo } from "../../domain/TransferenciaVehiculo"

export class ValidarImagenesAdjuntas implements Validador{
    private refArchivo
    private transferencia: TransferenciaVehiculo    
    constructor(transferencia, refArchivo) {
        this.transferencia = transferencia
        this.refArchivo = refArchivo
    }

    async validar(): Promise<boolean> {
        if (this.transferencia.estado == 'ACEPTADO'||this.transferencia.estado == 'PENDIENTE')
            if ((this.refArchivo.value.cantElementos + this.refArchivo.value.listadoArchivos.length) < 6)
                throw new Error('Debe ingresar al menos 6 fotografías o archivos adjuntos del vehículo que se va a asignar')        

        return true
    }
}