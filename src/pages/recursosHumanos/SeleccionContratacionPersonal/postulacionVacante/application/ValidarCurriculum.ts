import { Validador } from "shared/validadores/domain/Validador";

export class ValidarCurriculum implements Validador {
  private refArchivo
  private refArchivoUsuario
  private quieroSubirCV

  constructor(quierosubirCV, refArchivo, refArchivoUsuario) {
    this.refArchivoUsuario = refArchivoUsuario;
    this.quieroSubirCV = quierosubirCV;
    this.refArchivo = refArchivo;
  }

  async validar(): Promise<boolean> {
    // console.log('quieroSubir', this.quieroSubirCV.value)
    if (this.quieroSubirCV.value) {
      if (this.refArchivo.value.cantElementos === 0 && this.refArchivo.value.refGestor.files.length < 1) throw new Error('Debes subir tu Currículum Vitae en formato PDF')
    } else {
      if (this.refArchivoUsuario.value.selected.length === 0) throw new Error('Debes seleccionar un CV del listado')
    }

    return true
  }

}
