import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Subactividad } from 'recursosHumanos/planificador/domain/Subactividad'
import { opcionesPeriodicidad, opcionesSubactividadesPlanificador } from 'config/recursosHumanos.utils'

export const configuracionColumnasSubactividades: ColumnConfig<Subactividad>[] =
  [
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Actividades',
      align: 'left',
      style: 'min-width: 200px; overflow: auto;',
      editable: true
    },
    {
      name: 'responsable',
      field: 'responsable',
      label: 'Responsable',
      align: 'left',
      type: 'select',
      editable: true
    },
    {
      name: 'fecha_inicio',
      field: 'fecha_inicio',
      label: 'F. Inicio',
      align: 'left',
      type: 'date',
      editable: true
    },
    {
      name: 'fecha_fin',
      field: 'fecha_fin',
      label: 'F. Fin',
      align: 'left',
      type: 'date',
      editable: true
    },
    {
      name: 'estado_avance',
      field: 'estado_avance',
      label: 'Estado',
      align: 'left',
      type: 'select',
      options: opcionesSubactividadesPlanificador,
      style: 'min-width: 100px; overflow: auto;',
      editable: true
    },
    {
      name: 'periodicidad',
      field: 'periodicidad',
      label: 'Periodicidad',
      align: 'left',
      type: 'select',
      options: opcionesPeriodicidad,
      editable: true
    },
    {
      name: 'observaciones',
      field: 'observaciones',
      label: 'Observaciones',
      style: 'min-width: 200px; overflow: auto;',
      align: 'left',
      editable: true
    }
    // {
    //   name: 'completado',
    //   field: 'completado',
    //   label: '% Completado',
    //   align: 'center',
    //   type: 'number',
    //   editable: false
    // }
  ]
