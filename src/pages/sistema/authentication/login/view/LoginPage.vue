<template>
  <q-page>
    <div class="row justify-center items-center window-height bg-grey-2">
      <div class="col-12 col-md-6 col-lg-4 q-pa-lg column justify-center items-center">



        <span class="text-center">Bienvenidos a</span>
        <div class="imagen d-flex align-items-center justify-content-center">
          <q-avatar square size="100px">
            <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
          </q-avatar>
        </div>
        <h2 class="text-center q-mb-md">{{ nombreEmpresa }}</h2>
        <span class="text-center q-mb-lg">Inicie sesión con su cuenta</span>

        <!-- Login Form -->
        <form @submit.prevent="login" class="full-width q-px-lg">
          <div class="q-mb-sm">
            <q-input
              v-model="loginUser.name"
              label="Usuario"
              outlined
              dense
              @focus="startTyping"
              @blur="stopTyping"
            />
          </div>

          <div class="q-mb-sm">
            <q-input
              v-model="loginUser.password"
              label="Contraseña"
              outlined
              dense
              :type="isPwd ? 'password' : 'text'"
              @focus="startHidingEyes"
              @blur="stopHidingEyes"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="togglePasswordVisibility"
                />
              </template>
            </q-input>
          </div>

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


 /**Estilos para Avatar */
 .avatar-container {
  position: relative;
}

.avatar-svg {
  width: 100%;
  height: auto;
}

.cover-eyes circle {
  transform: translateY(10px); /* Baja los ojos para simular cubrirse */
  transition: transform 0.3s ease;
}

.peek circle:first-child {
  transform: translateY(0); /* Sube un ojo para ver la contraseña */
  transition: transform 0.3s ease;
}
</style>
