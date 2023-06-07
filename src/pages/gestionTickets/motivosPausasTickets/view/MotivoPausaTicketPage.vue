<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="columnas"
    :permitirEliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Motivo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Motivo de la pausa</label>
            <q-input
              v-model="motivoPausa.motivo"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.motivo.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.motivo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <br />
            <q-toggle
              v-model="motivoPausa.activo"
              checked-icon="check"
              color="positive"
              label="Activo"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./MotivoPausaTicketPage.ts"></script>
