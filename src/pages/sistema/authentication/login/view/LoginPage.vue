<template>
  <q-page class="gradiente-logind my-font">
    <div class="row justify-center q-pt-xl q-px-sm">
      <!-- Right side -->
      <div class="col-12 text-center q-mb-md">
        <img
          :src="!$q.dark.isActive ? logoClaro : logoOscuro"
          alt="logo"
          width="100"
        />
      </div>

      <div
        class="col-12 col-md-3 column borde q-py-lg rounded-card custom-shadow bg-solid"
      >
        <form @submit.prevent="login" class="full-width q-px-lg">
          <div class="q-mb-md">
            <!-- <h2>Bienvenidos a {{ nombreEmpresa }}</h2> -->
            <span class="text-h5 text-bold">Inicio de sesión</span>
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
              class="normal-text"
              hint="No comparta su contraseña con nadie"
              @keyup.enter="login()"
              style="text-transform: none"
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
            <q-checkbox
              v-model="loginUser.remember_session"
              label="Recuérdame"
            />
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
              label="Recuperar contraseña"
              class="full-width bg-grey-4 q-mb-sm"
              no-caps
              unelevated
              @click="recuperarPassword()"
            >
            </q-btn>
          </div>

          <div class="col-12 q-pt-xl q-mt-xl">
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

<style scoped>
h2 {
  line-height: 1.2;
  font-size: 1.714rem;
}

/* Quita las mayusculas al campo de contraseña y usuario */
/* .q-field .q-field__inner {
  text-transform: none !important;
} */

.gradiente-login {
  /* background: #0f0c29;
  background: -webkit-linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); 
  background: linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  );  */
  background: #667db6; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #667db6,
    #0082c8,
    #0082c8,
    #667db6
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #667db6,
    #0082c8,
    #0082c8,
    #667db6
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
