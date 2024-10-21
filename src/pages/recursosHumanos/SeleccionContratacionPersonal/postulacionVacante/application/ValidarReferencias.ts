import { Validador } from 'shared/validadores/domain/Validador'
import { Postulacion } from 'seleccionContratacion/postulacionVacante/domain/Postulacion'
import { ReferenciaPersonal } from 'seleccionContratacion/postulacionVacante/domain/ReferenciaPersonal'

export class ValidarReferencias implements Validador {
  private postulacion: Postulacion

  constructor(postulacion: Postulacion) {
    this.postulacion = postulacion
  }

  async validar(): Promise<boolean> {
    if (this.postulacion.referencias.length < 3)
      throw new Error('Debes ingresar mínimo 3 referencias personales')
    if(this.postulacion.referencias.some((v:ReferenciaPersonal)=> v.cargo==null||v.cargo=='')) throw new Error('Debes llenar todos los campos correspondientes al cargo, rol o parentesco en las referencias')
    if(this.postulacion.referencias.some((v:ReferenciaPersonal)=> v.telefono==null||v.telefono=='')) throw new Error('Debes llenar todos los campos correspondientes al número de teléfono en las referencias')
    if(this.postulacion.referencias.some((v:ReferenciaPersonal)=> v.correo==null||v.correo=='')) throw new Error('Debes llenar todos los campos correspondientes al correo en las referencias')
    return true
  }
}
