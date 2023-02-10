import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ProductoEnPercha } from '../domain/ProductoEnPercha'
import { endpoints } from 'config/api'

export class ProductosEnPerchaController extends TransaccionSimpleController<ProductoEnPercha>{
    constructor() {
        super(endpoints.productos_perchas)
    }
}