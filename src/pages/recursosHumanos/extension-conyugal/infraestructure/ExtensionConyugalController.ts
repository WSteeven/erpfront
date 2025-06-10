import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { ExtensionConyugal } from '../domain/ExtensionConyugal';
import { endpoints } from 'config/api';

export class ExtensionConyugalController extends TransaccionSimpleController<ExtensionConyugal>{
  constructor(){
    super(endpoints.extension_cobertura_salud)
  }
}

