import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class HorarioDeAlmuerzo extends EntidadAuditable {
  horaInicio: string | null;
  horaFin: string | null;

  constructor() {
    super();
    this.horaInicio = null;
    this.horaFin = null;
  }
}
