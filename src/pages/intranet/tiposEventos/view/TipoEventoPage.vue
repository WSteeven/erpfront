<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Tipos-Eventos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Tipo de Evento</label>
            <q-input
              v-model="tipo_evento.nombre"
              @update:model-value="(v) => (tipo_evento.nombre = removeAccents(v))"
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
              :label="tipo_evento.activo ? 'ACTIVO' : 'INACTIVO'"
              v-model="tipo_evento.activo"
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

<script src="./TipoEventoPage.ts"></script>
