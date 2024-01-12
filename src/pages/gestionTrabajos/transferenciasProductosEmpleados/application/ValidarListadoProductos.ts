import { Validador } from "shared/validadores/domain/Validador";
import { TransferenciaProductoEmpleado } from "../domain/TransferenciaProductoEmpleado";

export class ValidarExisteArchivo implements Validador {
  private transferencia: TransferenciaProductoEmpleado
  private refArchivo

  constructor(transferencia: TransferenciaProductoEmpleado, refArchivo) {
    this.transferencia = transferencia
    this.refArchivo = refArchivo
  }

  /*Validaciones */
  async validar(): Promise<boolean> {
    if (this.transferencia.listado_productos.length == 0) throw new Error('Debe agregar al menos un item al listado')


    // console.log(this.refArchivo.value)
    if (this.refArchivo.value.refGestor == undefined) {
      // console.log(this.refArchivo.value.listadoArchivos.length)
      if (this.refArchivo.value.listadoArchivos.length < 1) throw new Error('Debes adjuntar al menos un archivo')
    }
    else if (this.refArchivo.value.cantElementos === 0 && this.refArchivo.value.refGestor.files.length < 1 && this.refArchivo.value.listadoArchivos.length < 1) throw new Error('Se requiere al menos un archivo con la autorizacion de transferir materiales entre etapas.')


    return true
  }
}
