import { DescargableController } from 'shared/controller/domain/DescargableController'
import { endpoints } from 'config/api'

export class DescargarReporteBodega extends DescargableController {
    constructor(ruta: string) {
        super(endpoints.pedidos)
    }
}