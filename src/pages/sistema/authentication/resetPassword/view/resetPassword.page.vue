<template>
  <q-page class="">
    <div class="row items-center">
      <!-- Left side -->
      <div v-if="!$q.screen.xs && !$q.screen.sm" class="col-12 col-md-8 text-center q-pa-lg">
        <div class="imagen d-flex align-items-center justify-content-center">
          <q-avatar square size="400px">
            <img src="~assets/logo.svg" />
          </q-avatar>
        </div>
      </div>

      <!-- Right side -->
      <div class="col-12 col-md-4 column items-center bg-body-table justify-center window-height">
        <q-avatar v-if="$q.screen.xs" square size="120px" class="q-mx-auto block q-mb-md">
          <img src="~assets/logo.svg" />
        </q-avatar>

        <form @submit.prevent="resetearPassword" class="full-width q-px-lg">
          <div class="q-mb-sm">
            <h2>Bienvenidos a JPCONSTRUCRED</h2>
            <span>Cambia tu contraseña</span>
          </div>

          <!-- Contraseña Vieja-->
          <div class="col-12 q-mb-sm">
            <q-input v-model="resetPassword.password_old" label="Contraseña Vieja" outlined dense
              :type="isPwdold ? 'password' : 'text'" hint="Porfavor ingrese la contraseña antigua">
              <template v-slot:append>
                <q-icon :name="isPwdold ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdold = !isPwdold" />
              </template>
            </q-input>
          </div>

          <!-- Contraseña -->
          <div class="col-12 q-mb-sm">
            <q-input v-model="resetPassword.password" label="Contraseña Nueva" outlined dense
              :type="isPwd ? 'password' : 'text'" hint="No comparta su contraseña con nadie">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <!-- Confirmacion de contraseña -->
          <div class="col-12 q-mb-sm">
            <q-input v-model="resetPassword.password_confirmation" label="Confirmar Contraseña" outlined dense
              :type="isPwdConfirm ? 'password' : 'text'" hint="Porfavor confirme su contraseña">
              <template v-slot:append>
                <q-icon :name="isPwdConfirm ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdConfirm = !isPwdConfirm" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <!-- Botones -->
            <q-btn color="primary" label="Enviar codigo de recuperación" class="full-width q-mb-sm"
              :disabled="!enableLoginButton" no-caps unelevated @click="resetearPassword()">
            </q-btn>
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" src="./resetPassword.page.ts"></script>
<style>
h2 {
  line-height: 1.2;
  font-size: 1.714rem;
}

.empresa {
  position: fixed;
  top: 16px;
  left: 16px;
}

.fondo {
  background: rgb(94, 88, 252);
  background: linear-gradient(90deg,
      rgba(94, 88, 252, 1) 0%,
      rgba(110, 143, 255, 1) 100%);
}
</style>
