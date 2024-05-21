<template>
  <q-page>
    <div class="row items-center">
      <!-- Left side -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-12 col-md-8 justify-center q-pa-lg items-center row window-height"
        :class="{ 'bg-grey-2': !$q.dark.isActive }"
      >
        <div class="imagen d-flex align-items-center justify-content-center">
          <q-avatar square size="400px">
            <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
          </q-avatar>
        </div>
      </div>

      <!-- Right side -->
      <div
        class="col-12 col-md-4 column items-center bg-body-table justify-center window-height"
      >
        <q-avatar v-if="$q.screen.xs" square size="120px" class="q-mx-auto block q-mb-md">
          <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
        </q-avatar>

        <form @submit.prevent="login" class="full-width q-px-lg">
          <div class="q-mb-sm">
            <h2>Bienvenidos a {{ nombreEmpresa }}</h2>
            <span>COMPROMETIDOS A BRINDAR UN SERVICIO DE EXCELENCIA!</span>
          </div>
          <div class="col-12">
            <!-- Botones -->
            <q-btn
              color="primary"
              label="Ingrese con Linkedin"
              class="full-width q-mb-sm"
              no-caps
              unelevated
              icon="bi-linkedin"
              @click="loginTerceros('linkedin')"
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
              @click="loginTerceros('google')"
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
              @click="loginTerceros('facebook')"
            >
            </q-btn>
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
          <div class="q-pa-md row justify-center">
            <div class="col-6 q-my-sm">
              <p>¿Quieres ser parte de JP CONSTRUCRED?</p>
            </div>
            <div class="col-2">
              <!-- Botones -->
              <q-btn
                flat
                color="primary"
                label="Registrate"
                class="full-width q-mb-sm"
                no-caps
                unelevated
                @click="registro()"

              >
              </q-btn>
            </div>
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
</style>
