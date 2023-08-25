<template>
  <q-page class="">
    <!-- <div class="row items-center empresa">
      <q-avatar square>
        <img src="~assets/logo.png" />
      </q-avatar>
      <span class="text-primary q-ml-md text-h5">JPCONSTRUC</span
      ><span class="text-accent text-h5">RED</span>
    </div> -->

    <div class="row items-center">
      <!-- Left side -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-12 col-md-8 justify-center q-pa-lg items-center row window-height"
        :class="{ 'bg-grey-2': !$q.dark.isActive }"
      >
        <div class="imagen d-flex align-items-center justify-content-center">
          <q-avatar square size="400px">
            <img src="~assets/logoJP.png" />
          </q-avatar>
        </div>
      </div>

      <!-- Right side -->
      <div
        class="col-12 col-md-4 column items-center bg-body-table justify-center window-height"
      >
        <q-avatar
          v-if="$q.screen.xs"
          square
          size="120px"
          class="q-mx-auto block q-mb-md"
        >
          <img src="~assets/logo.png" />
        </q-avatar>

        <form @submit.prevent="login" class="full-width q-px-lg">
          <div class="q-mb-sm">
            <h2>Bienvenidos a JPCONSTRUCRED</h2>
            <span>Inicie sesión con su cuenta</span>
          </div>

          <!-- Usuario -->
          <div class="col-12 q-mb-sm">
            <q-input
              v-model="loginUser.name"
              label="Usuario"
              outlined
              dense
              @keyup.enter="login()"
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
              @keyup.enter="login()"
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
          <div class="col-12">
            <!-- Botones -->
            <q-btn
              flat
              color="primary"
              label="Recuperar contraseña"
              class="full-width q-mb-sm"
              no-caps
              unelevated
              @click="recuperarPassword()"
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
