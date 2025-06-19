import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { ConceptoIngreso } from '../domain/ConceptoIngreso';
import { endpoints } from 'config/api';

export class ConceptoIngresoController extends TransaccionSimpleController<ConceptoIngreso> {
  constructor() {
    super(endpoints.concepto_ingreso)
  }
}

