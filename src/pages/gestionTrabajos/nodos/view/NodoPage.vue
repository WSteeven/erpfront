<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnas"
    titulo-pagina="Nodos"
    :permitir-eliminar="false"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarListados"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Nombre del nodo</label>
            <q-input
              v-model="nodo.nombre"
              placeholder="Obligatorio"
              @update:model-value="v => (nodo.nombre = v.toUpperCase())"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Coordinador responsable</label>
            <q-select
              v-model="nodo.coordinador"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.coordinador.$errors.length"
              @blur="v$.coordinador.$touch"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component />
              </template>

              <template v-slot:error>
                <error-component clave="coordinador" :v$="v$" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Grupo/s</label>
            <q-select
              v-model="nodo.grupos"
              :options="grupos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              hint="Puede seleccionar uno o varios"
              dense
              outlined
              multiple
              use-chips
              use-input
              input-debounce="0"
              :error="!!v$.grupos.$errors.length"
              @blur="v$.grupos.$touch"
              @filter="filtrarGrupos"
              @popup-show="ordenarLista(grupos, 'nombre')"
              :option-label="v => v.nombre"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component />
              </template>

              <template v-slot:error>
                <error-component clave="grupos" :v$="v$" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-2">
            <br />
            <q-toggle
              v-model="nodo.activo"
              checked-icon="check"
              :disable="disabled"
              label="Activo"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./NodoPage.ts" />
<script setup lang="ts"></script>
