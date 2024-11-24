import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class HorarioLaboral extends EntidadAuditable {
  horaEntrada: string | null;
  horaSalida: string | null;

  constructor() {
    super();
    this.horaEntrada = null;
    this.horaSalida = null;
  }
}
