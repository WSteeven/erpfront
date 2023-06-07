<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasDepartamento"
    :permitir-eliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del departamento</label>
            <q-input
              v-model="departamento.nombre"
              placeholder="Obligatorio"
              @update:model-value="
                (v) => (departamento.nombre = v.toUpperCase())
              "
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <br />
            <q-toggle
              v-model="departamento.activo"
              checked-icon="check"
              :disable="disabled"
              label="Activo"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./DepartamentoPage.ts"></script>
