<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    :permitirEliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-none">
          <!--Tipo de Actividad -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Tipo de Actividad</label>
            <q-select
              v-model="tarea.tipo_actividad"
              :options="tipos_actividades"
              :disable="disabled"
              options-dense
              dense
              outlined
              hint="Obligatorio"
              :error="!!v$.tipo_actividad.$errors.length"
              @blur="v$.tipo_actividad.$touch"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tipo_actividad" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Asignada -->
          <div class="col-12 col-md-4 col-sm-3">
            <label class="q-mb-sm block">¿Asignada?</label>
            <q-toggle
              :label="tarea.asignada ? 'SI' : 'NO'"
              v-model="tarea.asignada"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- Grupo -->
          <div v-if="tarea.asignada || tarea.grupo" class="col-12 col-md-4">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="tarea.grupo"
              :options="grupos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              clearable
              use-input
              input-debounce="0"
              :error="!!v$.grupo.$errors.length"
              @blur="v$.grupo.$touch"
              @filter="filtrarGrupos"
              @popup-show="ordenarLista(grupos, 'nombre')"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="grupo" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!--Estado -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Estado de tarea</label>
            <q-select
              v-model="tarea.estado_tarea"
              :options="estados_tareas"
              :disable="disabled"
              options-dense
              dense
              outlined
              hint="Obligatorio"
              :error="!!v$.estado_tarea.$errors.length"
              @blur="v$.estado_tarea.$touch"
              :option-value="v => v.value"
              :option-label="v => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="estado_tarea" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- OT -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">OT</label>
            <q-input
              v-model="tarea.orden_trabajo"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.orden_trabajo.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Nombre cliente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre Cliente</label>
            <q-input
              v-model="tarea.nombre_cliente"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre_cliente.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre_cliente" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!--Direccion -->
          <div class="col col-12 col-md-12">
            <label class="q-mb-xs block">Dirección</label>
            <q-input
              v-model="tarea.direccion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.direccion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="direccion" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Referencia -->
          <div class="col col-12 col-md-12">
            <label class="q-mb-xs block">Referencia</label>
            <q-input
              v-model="tarea.referencia"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Latitud -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Latitud</label>
            <q-input
              v-model="tarea.latitud"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- Longitud -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Longitud</label>
            <q-input
              v-model="tarea.longitud"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>
          <!-- Mapa -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Mapa</label>
            <mapa-component
              :puntos="[
                {
                  lat: tarea.latitud ?? '-3.2621743954237297',
                  lng: tarea.longitud ?? '-79.95758902883551',
                  titulo: tarea.orden_trabajo ?? 'OT-000',
                  descripcion: tarea.nombre_cliente ?? 'Machala LED'
                }
              ]"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./TareaPage.ts" />
<style scoped></style>
