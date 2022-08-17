<template>
  <tab-layout
    :configuracionColumnas="configuracionColumnasTiposTareas"
    :datos="datos"
    titulo-pagina="Control diario de materiales"
  >
    <template #formulario>
      <q-form @submit.prevent="enviar()">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tarea JP -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="control.codigo_tarea_jp"
              label="Tarea"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Subtarea JP -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="control.codigo_subtarea_jp"
              label="Código de subtarea"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Fecha actual -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="control.fecha"
              label="Fecha actual"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <!-- Grupo -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="control.grupo"
              label="Grupo"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <!-- Tecnico responsable -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="control.tecnico_responsable"
              label="Técnico responsable"
              readonly
              outlined
              dense
            ></q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ControlDiarioMaterialPage.ts"></script>
