import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Justificacion extends EntidadAuditable {
  empleado: number | null;
  fecha_atraso: string | null; // Fecha de atraso.
  minutos_atraso: number | null; // Minutos de atraso.
  segundos_atraso: number | null; // Segundos de atraso.
  justificacion: string | null; // Texto de la justificación.
  requiere_justificacion: boolean | null;

  constructor() {
    super();
    this.empleado = null
    this.fecha_atraso = null
    this.minutos_atraso = null
    this.segundos_atraso = null
    this.justificacion = null
    this.requiere_justificacion=false
  }
}
