<template>
  <div id="fb-root"></div>
  <q-page class="gradiente-logind my-font">
    <div class="row justify-center q-pt-xl q-px-sm">
      <!-- Right side -->
      <div
        class="col-12 text-center q-mb-md"
      >         <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" alt="logo" width="100" /><br>
        <span class="text-thin text-h5 elegant-blue-hard-gradient-text">FIRSTRED</span>
      </div>

      <div
        class="col-12 col-md-3 column bordfe q-py-lg rounded-card shadow-chip bg-solid"
      >
        <form @submit.prevent="login" class="full-width q-px-lg">
          <div class="q-mb-sm">
<!--            <h4>Bienvenidos a {{ nombreEmpresa }}</h4>-->
<!--            <span class="text-h6 text-bold text-center bg-red">Bienvenidos a {{ nombreEmpresa }}</span>-->
            <span class="text-h5 text-bold">Inicio de sesión externo</span>
          </div>
          <div class="col-12">
            <!-- Botones -->
            <q-btn
              v-if="false"
              color="primary"
              label="Ingrese con Linkedin"
              class="full-width q-mb-sm"
              no-caps
              unelevated
              icon="bi-linkedin"
              @click="loginWithProvider('linkedin')"
            >
            </q-btn>
          </div>
          <div class="col-12">
            <!-- Botones -->
            <q-btn
              color="negative"
              label="Ingrese con Google"
              class="full-width q-mb-sm"
              no-caps
              unelevated
              icon="bi-google"
              @click="loginWithProvider('google')"
            >
            </q-btn>
          </div>
          <div class="col-12">
            <!-- Botones -->
            <q-btn
              color="primary"
              label="Ingrese con Facebook"
              class="full-width q-mb-sm"
              no-caps
              unelevated
              icon="bi-facebook"
              @click="loginWithProvider('facebook')"
            >
            </q-btn>
          </div>
          <div class="col-12">
            <div
              class="fb-login-button"
              data-width=""
              data-size=""
              data-button-type=""
              data-layout=""
              data-auto-logout-link="false"
              data-use-continue-as="true"
            ></div>
          </div>
          <div class="container q-my-md">
            <q-separator class="separator"></q-separator>
            <div class="text">O ingresa con tu usuario</div>
            <q-separator class="separator"></q-separator>
          </div>
          <!-- Usuario -->
          <div class="col-12 q-mb-sm">
            <q-input
              v-model="loginUser.name"
              label="Correo"
              type="email"
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
<!--          <div class="col-12 q-mb-sm">-->
<!--            <q-toggle v-model="loginUser.remember_session" label="Recuérdame" />-->
<!--          </div>-->

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
          <div class="q-pa-md row ">
            <div class="col-6 q-my-sm text-right ">
              <small>¿Quieres ser parte de JP CONSTRUCRED?</small>
            </div>
            <div class="col-6">
              <!-- Botones -->
              <q-btn
                flat
                color="primary"
                label="Regístrate"
                class="full-width q-mt-sm"
                no-caps
                unelevated
                @click="registro()"
              >
              </q-btn>
            </div>
          </div>
          <div class="col-12 q-pt-xl">
            <q-btn
              color="primary"
              label="¿Entrar como empleado?"
              class="full-width q-mb-sm"
              no-caps
              unelevated
              outline
              to="/login"
            />
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>
<script src="./LoginPostulantePage.ts"></script>
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

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.separator {
  flex: 0 0 auto;
  width: 30%;
  height: 1px;
  background-color: #ddd;
}

.fondo {
  background: rgb(94, 88, 252);
  background: linear-gradient(
    90deg,
    rgba(94, 88, 252, 1) 0%,
    rgba(110, 143, 255, 1) 100%
  );
}

.gradiente-login {
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
