import { Validador } from "shared/validadores/domain/Validador";
import { PreingresoMaterial } from "../../domain/PreingresoMaterial";

export class ValidarListadoProductos implements Validador {
  private preingreso: PreingresoMaterial
  private refArchivo

  constructor(preingreso: PreingresoMaterial, refArchivo) {
    this.preingreso = preingreso
    this.refArchivo = refArchivo
  }

  /*Validaciones */
  async validar(): Promise<boolean> {
    if (this.preingreso.listadoProductos.length == 0) throw new Error('Debe agregar al menos un item al listado')

    if (!this.preingreso.proyecto && this.preingreso.listadoProductos.some((item) => item.fotografia == null || item.fotografia == undefined)) throw new Error('Debe ingresar una fotografía en cada elemento del listado')
    else {
      // console.log(this.refArchivo.value)
      if (this.refArchivo.value.refGestor == undefined){
        // console.log(this.refArchivo.value.listadoArchivos.length)
        if (this.refArchivo.value.listadoArchivos.length < 1) throw new Error('Debes adjuntar al menos un archivo')
      }
      else if (this.refArchivo.value.cantElementos===0 && this.refArchivo.value.refGestor.files.length < 1 && this.refArchivo.value.listadoArchivos.length < 1) throw new Error('Se requiere al menos un archivo con la guía del material recibido')
    }

    return true
  }

}
