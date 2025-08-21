import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Empleado } from '../domain/Empleado'
import { endpoints } from 'config/api'

export class EmpleadoPrestamosEmpresarialesController extends TransaccionSimpleController<Empleado>{
    constructor() {
        super(endpoints.obtener_empleados_prestamos_empresariales)
    }
}