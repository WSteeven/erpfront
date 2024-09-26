<template>
  <q-form @submit.prevent>
    <div class="row q-col-gutter-sm q-py-md">
      <!-- nombre -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Nombre del Cargo</label>
        <q-input
          v-model="cargo.nombre"
          @update:model-value="(v) => (cargo.nombre = removeAccents(v))"
          placeholder="Obligatorio"
          :disable="disabled"
          :error="!!v$.nombre.$errors.length"
          outlined
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.nombre.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Estado -->
      <div class="col-12 col-md-3">
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
    </div>
    <div :class="{ 'q-pa-md': $q.screen.xs }">
      <div class="row justify-end q-col-gutter-x-xs">
        <button-submits
          :accion="acciones.nuevo"
          :permitirGuardar="true"
          :disabled="storeCargando.cargando"
          labelGuardar="Guardar"
          @cancelar="cancelar"
          @guardar="guardar(cargo)"
        />
      </div>
    </div>
  </q-form>
</template>

<script src="./CrearCargoPage.ts" />
