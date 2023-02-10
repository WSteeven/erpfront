import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Span } from '../domain/Span'
import { endpoints } from 'config/api'

export class SpanController extends TransaccionSimpleController<Span>{
    constructor() {
        super(endpoints.spans)
    }
}