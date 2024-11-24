import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class HorarioLaboral extends EntidadAuditable {
  horaEntrada: Date | null;
  horaSalida: Date | null;

  constructor() {
    super();
    this.horaEntrada = null;
    this.horaSalida = null;
  }
}
