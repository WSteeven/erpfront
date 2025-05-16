import { Validador } from 'shared/validadores/domain/Validador'
import { VisitaDomiciliaria } from 'trabajoSocial/visitaDomiciliaria/domain/VisitaDomiciliaria'

export class ValidarListadoIngresosEconomia implements  Validador{
  private visita: VisitaDomiciliaria;

  constructor(visita: VisitaDomiciliaria) {
    this.visita = visita
  }

  async validar():Promise<boolean>{
    if(this.visita.economia_familiar?.ingresos.length==0) throw new Error('Debe agregar al menos un registro al listado de ingresos en la economia familiar')

    return true
  }
}
