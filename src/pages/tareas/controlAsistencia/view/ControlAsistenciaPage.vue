<template>
  <tab-layout
    :configuracionColumnas="configuracionColumnas"
    :mixin="mixin"
    titulo-pagina="Control de asistencia"
  >
    <template #formulario>
      <q-card flat bordered class="q-mb-md">
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Tarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="control.tarea"
              :options="listadosAuxiliares.tareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :option-label="(item) => item.detalle"
              :option-value="(item) => item.id"
              emit-value
              map-options
              ><template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.detalle }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="control.grupo"
              :options="listadosAuxiliares.grupos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              clearable
              :error="!!v$.grupo.$errors.length"
            >
              <!--@update:model-value="obtenerResponsables(subtarea.grupo)"-->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.grupo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora de asistencia</label>
            <q-input
              v-model="control.fecha_hora"
              outlined
              dense
              disable
            ></q-input>
          </div>

          <!-- Jornada -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Jornada</label>
            <q-select
              v-model="control.jornada"
              :options="tiposJornadas"
              :error="!!v$.jornada.$errors.length"
              options-dense
              dense
              outlined
            >
              <template v-slot:error>
                <div v-for="error of v$.jornada.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Imagen -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Foto de evidencia</label>
            <selector-imagen
              :modelValue="control.imagen"
              @update:modelValue="(data) => (control.imagen = data)"
            ></selector-imagen>
          </div>
        </div>
      </q-card>

      <div class="q-gutter-md column">
        <essential-table
          titulo="Listado de trabajadores"
          :configuracionColumnas="
            configuracionColumnasMaterialesSolicitadosAccion
          "
          :datos="listadosAuxiliares.empleados"
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
