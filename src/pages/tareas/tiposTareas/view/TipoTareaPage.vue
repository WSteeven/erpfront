<template>
  <tab-layout
    :configuracionColumnas="(configuracionColumnasTiposTareas as any)"
    :datos="datos"
    titulo-pagina="Tipo de tareas"
  >
    <template #formulario>
      <q-form @submit.prevent="enviar()">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-input
              v-model="tipoTarea.cliente"
              placeholder="Obligatorio"
              outlined
              dense
              :rules="[(val: string) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="tipoTarea.nombre"
              placeholder="Obligatorio"
              outlined
              dense
              :rules="[(val: string) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <div class="col-12 col-md-3 q-pt-lg">
            <q-checkbox
              v-model="tipoTarea.tiene_categoria"
              label="Tiene categoría"
            />
          </div>

          <!-- Categoria -->
          <div v-if="tipoTarea.tiene_categoria" class="col-12 col-md-3">
            <label class="q-mb-sm block">Categoría</label>
            <q-input
              v-model="tipoTarea.categoria"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script lang="ts" setup>
// Dependencias
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTiposTareas'
import { reactive } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'

// Logica y controladores
import { TipoTarea } from '../domain/TipoTarea'

const tipoTarea = reactive(new TipoTarea())

const datos = [
  {
    cliente: 'ACCESS',
    categoria: 'RECABLEADO',
    nombre: 'RFO01-RECABLEADO CUADNO EL DAÑO ES FUERA DE CASA DEL CLIENTE',
  },
  {
    cliente: 'ACCESS',
    categoria: 'INSTALACIÓN NUEVA',
    nombre: 'IBF01-INSTALACIÓN BÁSICA CASA GPON HASTA 300 METROS',
  },
  {
    cliente: 'ACCESS',
    categoria: 'INSTALACIÓN NUEVA',
    nombre: 'IBF02-INSTALACIÓN BÁSICA EDIFICIO GPON 300 METROS',
  },
  {
    cliente: 'NEDETEL',
    categoria: 'TAREA PROGRAMADA',
    nombre: 'TP-ARREGLO PATH NODO',
  },
  {
    cliente: 'NEDETEL',
    categoria: 'TAREA PROGRAMADA',
    nombre: 'TP-CAMBIO DE MANGAS',
  },
  {
    cliente: 'NEDETEL',
    categoria: 'CORTE FIBRA',
    nombre: 'CF-ACCIDENTE DE TRÁNSITO',
  },
  {
    cliente: 'NEDETEL',
    categoria: '',
    nombre: 'INSTALACIÓN',
  },
  {
    cliente: 'NEDETEL',
    categoria: '',
    nombre: 'CABLEADO',
  },
  {
    cliente: 'TELCONET',
    categoria: '',
    nombre: 'HINCADO',
  },
  {
    cliente: 'TELCONET',
    categoria: '',
    nombre: 'RETIRO',
  },
  {
    cliente: 'TELCONET',
    categoria: '',
    nombre: 'TENDIDO',
  },
  {
    cliente: 'TELCONET',
    categoria: '',
    nombre: 'DESMONTAJE',
  },
]

function enviar() {
  //
}
</script>
