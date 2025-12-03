<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Cargos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del Cargo</label>
            <q-input
              v-model="cargo.nombre"
              @update:model-value="v => (cargo.nombre = removeAccents(v))"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Area -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Area</label>
            <q-select
                v-model="cargo.area"
                options-dense
                hint="Selecciona o escribe una nueva y presiona enter"
                :disable="disabled"
                dense
                outlined
                use-input
                use-chips
                :error="!!v$.area.$errors.length"
                input-debounce="0"
                @new-value="crearArea"
                :options="areas"
                @filter="filtrarAreas"
            >
              <template v-slot:error>
                <error-component clave="area" :v$="v$" />
              </template>
            </q-select>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Estado</label>
            <q-toggle
              :label="cargo.estado ? 'ACTIVO' : 'INACTIVO'"
              v-model="cargo.estado"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- Aprobado RRHH -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Aprobado</label>
            <q-toggle
              :label="cargo.aprobado_rrhh ? 'SI' : 'NO'"
              v-model="cargo.aprobado_rrhh"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./CargoPage.ts"></script>
