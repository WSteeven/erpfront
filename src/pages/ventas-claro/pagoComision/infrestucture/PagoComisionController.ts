import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { PagoComision } from '../domain/PagoComision';
import { endpoints } from 'config/api';

export class PagoComisionController extends TransaccionSimpleController<PagoComision> {
  constructor() {
    super(endpoints.cortes_pagos_comisiones)
  }
}

