<template>
  <tab-layout
    :configuracionColumnas="configuracionColumnas"
    :mixin="mixin"
    titulo-pagina="Control de asistencia"
  >
    <template #formulario>
      <q-card flat bordered class="q-mb-md">
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Código tarea JP -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código tarea JP</label>
            <q-input v-model="control.codigo_tarea_jp" outlined dense></q-input>
          </div>

          <!-- Detalle tarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Detalle de tarea</label>
            <q-input
              v-model="control.codigo_tarea_jp"
              outlined
              dense
              readonly
            ></q-input>
          </div>

          <!-- Código subtarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código de subtarea</label>
            <q-input v-model="control.codigo_subtarea" outlined dense></q-input>
          </div>

          <!-- Detalle subtarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Detalle de subtarea</label>
            <q-input
              v-model="control.detalle_subtarea"
              outlined
              dense
              readonly
            ></q-input>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="control.fecha" outlined dense readonly></q-input>
          </div>

          <!-- Hora -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora de registro de asistencia</label>
            <q-input v-model="control.hora" outlined dense readonly></q-input>
          </div>

          <!-- Imagen -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Imagen</label>
            <selector-imagen
              :modelValue="control.imagen"
              @update:modelValue="(data) => (control.imagen = data)"
            ></selector-imagen>
          </div>
        </div>
      </q-card>

      <div class="q-gutter-md column">
        <essential-table
          titulo="técnicos"
          :configuracionColumnas="
            configuracionColumnasMaterialesSolicitadosAccion
          "
          :datos="asistenciaTecnicos"
          :permitirConsultar="false"
          :permitirEliminar="false"
          :permitirEditar="false"
          :mostrarBotones="false"
          :accion1="botonAgregarObservacion"
          tipoSeleccion="multiple"
          @editar="editar"
          @eliminar="eliminar"
        ></essential-table>
      </div>
    </template>
  </tab-layout>
</template>

<script src="./ControlAsistenciaPage.ts"></script>
