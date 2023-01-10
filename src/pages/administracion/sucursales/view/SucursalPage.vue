<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Sucursales"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Lugar -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Lugar/ciudad</label>
            <q-input
              v-model="sucursal.lugar"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.lugar.$errors - length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.lugar.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Telefono -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Telefono</label>
            <q-input
              v-model="sucursal.telefono"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.telefono.$errors - length"
              outlined
              dense
              type="tel"
              mask="### ### ####"
              unmasked-value
            >
              <template v-slot:error>
                <div v-for="error of v$.telefono.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Correo -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Correo</label>
            <q-input
              v-model="sucursal.correo"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.correo.$errors - length"
              outlined
              dense
              type="email"
            >
              <template v-slot:error>
                <div v-for="error of v$.correo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./SucursalPage.ts"></script>
