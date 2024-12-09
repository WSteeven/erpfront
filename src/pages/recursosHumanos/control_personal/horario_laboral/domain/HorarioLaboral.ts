import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class HorarioLaboral extends EntidadAuditable {
  hora_entrada: Date | null;
  hora_salida: Date | null;

  constructor() {
    super();
    this.hora_entrada = null;
    this.hora_salida = null;
  }
}
