import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PlantillaCapacitacion } from './PlantillaCapacitacion'

export const configuracionColumnasPlantillaCapacitacion: ColumnConfig<PlantillaCapacitacion>[] =
  [
    {
      name: 'tema',
      field: 'tema',
      label: 'Tema',
      align: 'left',
      sortable: true
    },
    {
      name: 'fecha',
      field: 'fecha',
      label: 'Fecha',
      align: 'left',
      sortable: true
    },
    {
      name: 'hora_inicio',
      field: 'hora_inicio',
      label: 'Hora Inicio',
      align: 'left',
      sortable: true
    },
    {
      name: 'hora_fin',
      field: 'hora_fin',
      label: 'Hora Fin',
      align: 'left',
      sortable: true
    },
    {
      name: 'capacitador_id',
      field: 'capacitador_id',
      label: 'Capacitador',
      align: 'left',
      sortable: true
    },
    {
      name: 'modalidad',
      field: 'modalidad',
      label: 'Modalidad',
      align: 'left',
      sortable: true
    },
  ]
