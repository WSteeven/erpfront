<template>
  <tab-layout :mixin="mixin" :mostrarListado="false">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Contraseña Actual -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Contraseña actual</label>
            <q-input
              v-model="cambiarContrasena.current_password"
              placeholder="Obligatorio"
              :error="!!v$.current_password.$errors.length"
              :disable="disabled"
              outlined
              dense
              :type="isPwdCurent ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdCurent ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdCurent = !isPwdCurent"
                />
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.current_password.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Contraseña Nueva -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Nueva contraseña</label>
            <q-input
              v-model="cambiarContrasena.password"
              placeholder="Obligatorio"
              :error="!!v$.password.$errors.length"
              :disable="disabled"
              outlined
              dense
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>

              <template v-slot:error>
                <div v-for="error of v$.password.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Contraseña Confirmacion -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Repita la nueva contraseña</label>
            <q-input
              v-model="cambiarContrasena.password_confirmation"
              placeholder="Obligatorio"
              :error="!!v$.password_confirmation.$errors.length"
              :disable="disabled"
              outlined
              dense
              :type="isPwdConfirmation ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdConfirmation ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdConfirmation = !isPwdConfirmation"
                />
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.password_confirmation.$errors"
                  :key="error.$uid"
                >
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
<script src="./cambiarContrasenaPage.ts"></script>
