import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { RespuestaCuestionarioEmpleado } from "./RespuestaCuestionarioEmpleado";

export const configuracionColumnasUmbral: ColumnConfig<RespuestaCuestionarioEmpleado>[] = [
  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'pregunta_info',
    field: 'pregunta_info',
    label: 'Pregunta',
    align: 'left',
    sortable: true
  },
  {
    name: 'respuesta_info',
    field: 'respuesta_info',
    label: 'Respuesta',
    align: 'left',
    sortable: true
  },



]
