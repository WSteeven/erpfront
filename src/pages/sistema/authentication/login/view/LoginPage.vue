<template>
  <q-page padding>
    <div class="q-pa-xs row">
      <img src="src/assets/logo.jpeg" height="30" />
      <span class="q-ml-md fw-bold text-h5">JPConstrucred</span>
    </div>

    <div class="row items-center q-pa-xl">
      <!-- Left side -->
      <div class="col-12 col-md-8 text-center q-pa-lg">
        <img
          src="src/assets/login.svg"
          alt="Imagen bienvenida"
          class="portada"
        />
      </div>

      <!-- Right side -->
      <div
        class="col-12 col-md-4 q-px-4 text-start row items-center justify-center"
      >
        <form @submit.prevent="login">
          <div class="q-gutter-sm">
            <div class="q-pb-md">
              <h2>Bienvenidos a JPConstrucred</h2>
              <span>Inicie sesión con su cuenta</span>
            </div>

            <!-- Correo -->
            <div class="col-12 q-mb-md">
              <q-input
                v-model="loginUser.email"
                type="email"
                label="Correo"
                outlined
                dense
              />
            </div>

            <!-- Contraseña -->
            <div class="col-12 q-mb-md">
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
            <div class="col-12 q-mb-md">
              <q-toggle
                v-model="loginUser.remember_session"
                label="Recuérdame"
              />
            </div>

            <!-- Botones -->
            <q-btn
              color="primary"
              label="Iniciar sesión"
              class="full-width"
              :disabled="!enableLoginButton"
              no-caps
              unelevated
              @click="login()"
            >
            </q-btn>
            <!--  <router-link :to="{ name: 'Register' }" class="btn btn-danger"
              >Crear cuenta</router-link
            >
            <router-link :to="{ name: 'ForgotPassword' }" class="form-text"
              >¿Olvidaste tu contraseña?</router-link
            > -->
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>

<script src="./LoginPage.ts"></script>

<style lang="scss" scoped>
h2 {
  line-height: 1.2;
  font-size: 1.714rem;
}

.portada {
  width: 75%;
}

@media (max-width: 1023px) {
  .portada {
    display: none;
  }
}
</style>
