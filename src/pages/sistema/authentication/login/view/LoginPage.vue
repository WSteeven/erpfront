<template>
  <q-page>
    <div class="login-container">
      <div class="login-card">

        <!-- Bienvenida -->
        <span class="welcome-text">Bienvenidos a</span>
        <div class="logo-container">
          <q-avatar square style="height: 200px; width: auto;">
            <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
          </q-avatar>
        </div>

        <!-- Formulario de inicio de sesión -->
        <form @submit.prevent="login" class="login-form" @keyup.enter="login">
          <div class="input-wrapper">
            <q-icon name="mail" class="input-icon" />
            <q-input
              v-model="loginUser.name"
              label="Correo electrónico"
              outlined
              dense
              class="input-field"
            />
          </div>

          <div class="input-wrapper">
            <q-icon name="lock" class="input-icon" />
            <q-input
              v-model="loginUser.password"
              label="Contraseña"
              outlined
              dense
              :type="isPwd ? 'password' : 'text'"
              class="input-field"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="toggle-icon"
                  @click="togglePasswordVisibility"
                />
              </template>
            </q-input>
          </div>

          <q-btn
            label="Iniciar sesión"
            class="btn-login"
            :disabled="!enableLoginButton"
            no-caps
            unelevated
            @click="login"
          />
          <span class="forgot-text" @click="recuperarPassword">
            ¿Olvidó su nombre de usuario o contraseña?
          </span>
        </form>
      </div>
    </div>
  </q-page>
</template>


<script src="./LoginPage.ts"></script>

<style scoped>
/* Contenedor principal */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--q-color-grey-2);
  padding: 1rem;
}

/* Tarjeta de inicio de sesión */
.login-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 480px; /* Card más grande */
  width: 100%;
  text-align: center;
}

/* Texto de bienvenida */
.welcome-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--q-color-grey-8);
  margin-bottom: 1rem;
}

/* Nombre de la empresa */
.company-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--q-color-primary);
  margin: 0.5rem 0 1.5rem;
}

/* Contenedor del logo */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

/* Formulario */
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Input con iconos */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--q-color-grey-6);
  font-size: 1.25rem;
}

.input-field {
  width: 100%;
  padding-left: 40px; /* Espacio para el icono */
}

/* Botón de inicio de sesión */
.btn-login {
  width: 100%;
  padding: 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  background-color: rgb(6, 38, 97);
  color: #ffffff;
  border-radius: 8px;
}

/* Texto de recuperación de contraseña */
.forgot-text {
  font-size: 0.875rem;
  color: var(--q-color-grey-7);
  text-align: center;
  margin-top: 1rem;
  cursor: pointer;
  text-decoration: underline;
}
.forgot-text:hover {
  color: var(--q-color-grey-9);
}


/* Input general */
.input-field {
  width: 100%;
  border-radius: 8px;
  padding-left: 40px; /* Espacio para el icono */
  font-size: 1rem;
}

/* Estilo mejorado */
.improved-input {
  background-color: var(--q-color-grey-1);
  border: 1px solid var(--q-color-grey-4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

/* Hover y foco */
.improved-input:hover {
  border-color: var(--q-color-primary);
  background-color: var(--q-color-grey-2);
}

.improved-input:focus-within {
  border-color: var(--q-color-primary);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

/* Iconos de input */
.input-icon {
  position: absolute;
  left: 12px;
  color: var(--q-color-grey-6);
  font-size: 1.5rem;
  transition: color 0.2s ease-in-out;
}

.input-wrapper:hover .input-icon {
  color: var(--q-color-primary);
}

.toggle-icon {
  color: var(--q-color-grey-6);
  cursor: pointer;
}

.toggle-icon:hover {
  color: var(--q-color-primary);
}
</style>
