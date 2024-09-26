import { Validador } from 'src/shared/validadores/domain/Validador';
import { SolicitudPuestoEmpleo } from '../../domain/SolicitudPuestoEmpleo';
import { FormacionAcademica } from '../../domain/FormacionAcademica';

export class ValidarFormacionesAcademicas implements Validador {
  private solicitud: SolicitudPuestoEmpleo
  private refArchivo

  constructor(solicitud: SolicitudPuestoEmpleo, refArchivo) {
    this.solicitud = solicitud
    this.refArchivo = refArchivo
  }

  async validar(): Promise<boolean> {
    if (this.solicitud.formaciones_academicas.length > 0) {
      // console.log(this.solicitud.formaciones_academicas)
      if (this.solicitud.formaciones_academicas.some((item: FormacionAcademica) => item.nivel == null || item.nivel == undefined)) throw new Error('Debe ingresar un nivel en cada formación académica.')
      if (this.solicitud.formaciones_academicas.some((item: FormacionAcademica) => item.nombre == null || item.nombre == undefined || item.nombre == '')) throw new Error('Debe ingresar un nombre de título en cada formación académica.')
    }
    // if (this.solicitud.tipo_puesto == 1) {
    //   console.log(this.refArchivo.value)
    //   if ((this.refArchivo.value.cantElementos + this.refArchivo.value.listadoArchivos.length) < 1) {
    //     throw new Error('Debe adjuntar 1 documento de manual de funciones')
    //   }
    // }
    return true
  }
}
