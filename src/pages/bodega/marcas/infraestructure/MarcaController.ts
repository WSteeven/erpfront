import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Marca } from '../domain/Marca'
import { endpoints } from 'config/api'

export class MarcaController extends TransaccionSimpleController<Marca>{
    constructor() {
        super(endpoints.marcas)
    }
}