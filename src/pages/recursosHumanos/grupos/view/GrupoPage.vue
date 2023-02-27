<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasGrupo"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del grupo</label>
            <q-input
              v-model="grupo.nombre"
              placeholder="Obligatorio"
              @update:model-value="(v) => (grupo.nombre = v.toUpperCase())"
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
              v-model="grupo.activo"
              checked-icon="check"
              label="Activo"
              unchecked-icon="clear"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./GrupoPage.ts"></script>
