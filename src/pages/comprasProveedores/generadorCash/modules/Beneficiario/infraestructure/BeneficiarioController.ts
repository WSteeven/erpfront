import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Beneficiario } from '../domain/Beneficiario'
import { endpoints } from 'config/api'

export class BeneficiarioController extends TransaccionSimpleController<Beneficiario> {
    constructor() {
        super(endpoints.beneficiarios)
    }
}
