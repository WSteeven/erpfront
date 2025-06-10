<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasCertificacion"
    :permitir-eliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Certificación</label>
            <q-input
              v-model="certificacion.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.descripcion.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <br />
            <q-toggle
              v-model="certificacion.activo"
              label="Activo"
              :disable="disabled"
              checked-icon="bi-check"
              color="positive"
              outlined
              dense
            ></q-toggle>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./CertificacionPage.ts"></script>
