<template>
  <div class="q-mb-md">
    <essential-table
      titulo="Cronología de trabajo realizado"
      :configuracionColumnas="(columnasTrabajoRealizado as any)"
      :datos="cronologiaTrabajoRealizado"
      :alto-fijo="false"
      :permitirConsultar="false"
      :mostrar-footer="false"
      :agregarElemento="agregarActividadRealizada"
      @eliminar="tablaTrabajoRealizado.eliminar"
      @editar="tablaTrabajoRealizado.editar"
    ></essential-table>
  </div>

  <div class="q-mb-md">
    <essential-table
      titulo="Observaciones / Mejoras / Pendientes"
      :configuracionColumnas="(columnasObservacion as any)"
      :datos="observaciones"
      :alto-fijo="false"
      :permitirConsultar="false"
      :mostrar-footer="false"
      :agregarElemento="agregarObservacion"
      @eliminar="tablaObservacion.eliminar"
      @editar="tablaObservacion.editar"
    ></essential-table>
  </div>

  <div class="q-mb-md">
    <essential-table
      titulo="Listado de materiales"
      :configuracionColumnas="(columnasMaterial as any)"
      :datos="materiales"
      :alto-fijo="false"
      :permitirConsultar="false"
      :mostrar-footer="false"
      :agregarElemento="agregarMaterial"
      @eliminar="tablaMateriales.eliminar"
      @editar="tablaMateriales.editar"
    ></essential-table>
  </div>
</template>

<script lang="ts" setup>
// Dependencias
import { configuracionColumnasTrabajoRealizado } from '../domain/configuracionColumnasTrabajoRealizado'
import { configuracionColumnasObservacion } from '../domain/configuracionColumnasObservacion'
import { configuracionColumnasMaterial } from '../domain/configuracionColumnasMaterial'
import TrabajoRealizado from '../domain/TrabajoRealizado'
import Observacion from '../domain/Observacion'
import Material from '../domain/Material'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

const acciones = {
  name: 'acciones',
  field: 'acciones',
  label: 'Acciones',
  align: 'center',
}

const columnasTrabajoRealizado = [
  ...configuracionColumnasTrabajoRealizado,
  acciones,
]

const columnasObservacion = [...configuracionColumnasObservacion, acciones]

const columnasMaterial = [...configuracionColumnasMaterial, acciones]

const cronologiaTrabajoRealizado: TrabajoRealizado[] = [
  {
    id: 1,
    hora: '08:15:14',
    detalle: 'SE REALIZÓ LA PAUSA POR ...',
  },
  {
    id: 2,
    hora: '12:36:45',
    detalle: 'HORA DE ALMUERZO ...',
  },
]

const observaciones: Observacion[] = [
  {
    id: 1,
    detalle: 'SE REALIZÓ LA PAUSA POR ...',
  },
  {
    id: 2,
    detalle: 'HORA DE ALMUERZO ...',
  },
]

const materiales: Material[] = [
  {
    id: 1,
    producto: 'VARILLA DE ANCLAJE',
    medida: 'UNIDAD',
    cantidad_usada: 1,
  },
  {
    id: 2,
    producto: 'CABLE TENSOR',
    medida: 'METRO',
    cantidad_usada: 2,
  },
  {
    id: 3,
    producto: 'GRILLETES',
    medida: 'UNIDAD',
    cantidad_usada: 2,
  },
]

const tablaTrabajoRealizado = {
  eliminar: () => {
    //
  },
  editar: () => {
    //
  },
}

const tablaObservacion = {
  eliminar: () => {
    //
  },
  editar: () => {
    //
  },
}

const tablaMateriales = {
  eliminar: () => {
    //
  },
  editar: () => {
    //
  },
}

const agregarActividadRealizada: CustomActionTable = {
  titulo: 'Agregar actividad realizada',
  accion: () => {
    //
  },
}

const agregarObservacion: CustomActionTable = {
  titulo: 'Agregar observación',
  accion: () => {
    //
  },
}

const agregarMaterial: CustomActionTable = {
  titulo: 'Agregar material',
  accion: () => {
    //
  },
}
</script>
