<template>
  <q-page>
    <div class="row justify-center items-center window-height">
      <!-- Left side with the logo -->
      <div
        class="col-12 col-md-6 col-lg-4 q-pa-lg column justify-center items-center"
        :class="{ 'bg-grey-2': !$q.dark.isActive }"
      >
        <q-avatar square size="200px" class="q-mb-lg">
          <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
        </q-avatar>
        <h2 class="text-center q-mb-md">Bienvenidos a {{ nombreEmpresa }}</h2>
        <span class="text-center q-mb-lg">Inicie sesión con su cuenta</span>

        <!-- Login Form -->
        <form @submit.prevent="login" class="full-width q-px-lg">
          <!-- Usuario -->
          <div class="q-mb-sm">
            <q-input
              v-model="loginUser.name"
              label="Usuario"
              outlined
              dense
              @keyup.enter="login"
            />
          </div>

          <!-- Contraseña -->
          <div class="q-mb-sm">
            <q-input
              v-model="loginUser.password"
              label="Contraseña"
              outlined
              dense
              :type="isPwd ? 'password' : 'text'"
              class="normal-text"
              hint="No comparta su contraseña con nadie"
              @keyup.enter="login"
              style="text-transform: none;"
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
          <div class="q-mb-sm">
            <q-toggle v-model="loginUser.remember_session" label="Recuérdame" />
          </div>

          <!-- Botones -->
          <q-btn
            color="primary"
            label="Iniciar sesión"
            class="full-width q-mb-sm"
            :disabled="!enableLoginButton"
            no-caps
            unelevated
            @click="login"
          />
          <q-btn
            flat
            color="primary"
            label="Recuperar contraseña"
            class="full-width q-mb-sm"
            no-caps
            unelevated
            @click="recuperarPassword"
          />

          <!-- Entrar como externo -->
          <div class="q-pt-lg q-mt-lg">
            <q-btn
              color="primary"
              label="¿Entrar como externo?"
              class="full-width q-mb-sm"
              no-caps
              unelevated
              outline
              :to="{ name: 'LoginPostulante' }"
            />
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>

<script src="./LoginPage.ts"></script>

<style scope>
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

/* Quita las mayusculas al campo de contraseña y usuario */
/* .q-field .q-field__inner {
  text-transform: none !important;
} */
</style>
