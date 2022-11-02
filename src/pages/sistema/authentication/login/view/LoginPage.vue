<template>
  <q-page class="bg-grey-2">
    <div class="row items-center empresa">
      <q-avatar square>
        <img src="~assets/logo.svg" />
      </q-avatar>
      <span class="q-ml-md text-h5">CONSTRUCRED</span>
    </div>

    <div class="row items-center">
      <!-- Left side -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-12 col-md-8 text-center q-pa-lg"
      >
        <div class="imagen d-flex align-items-center justify-content-center">
          <lottie-player
            :animationData="loginJson"
            background="transparent"
            :speed="1"
            style="width: 400px; height: 400px"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>

      <!-- Right side -->
      <div
        class="col-12 col-md-4 row items-center justify-center bg-white window-height"
      >
        <form @submit.prevent="login" class="full-width q-px-lg">
          <div class="q-mb-sm">
            <h2>Bienvenidos a JPCONSTRUCRED</h2>
            <span>Inicie sesión con su cuenta</span>
          </div>

          <!-- Correo -->
          <div class="col-12 q-mb-sm">
            <q-input
              v-model="loginUser.email"
              type="email"
              label="Correo"
              outlined
              dense
            />
          </div>

          <!-- Contraseña -->
          <div class="col-12 q-mb-sm">
            <q-input
              v-model="loginUser.password"
              label="Contraseña"
              outlined
              dense
              :type="isPwd ? 'password' : 'text'"
              hint="No comparta su contraseña con nadie"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <!-- Recuerdame -->
          <div class="col-12 q-mb-sm">
            <q-toggle v-model="loginUser.remember_session" label="Recuérdame" />
          </div>

          <div class="col-12">
            <!-- Botones -->
            <q-btn
              color="primary"
              label="Iniciar sesión"
              class="full-width q-mb-sm"
              :disabled="!enableLoginButton"
              no-caps
              unelevated
              @click="login()"
            >
            </q-btn>
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>

<script src="./LoginPage.ts"></script>

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
  background: linear-gradient(
    90deg,
    rgba(94, 88, 252, 1) 0%,
    rgba(110, 143, 255, 1) 100%
  );
}
</style>
