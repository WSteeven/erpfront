<template>
  <q-page class="bg-white my-font">
    <div class="row items-center justify-between q-px-md q-px-xl-md q-py-xl">
      <!-- LADO IZQUIERDO (solo >= md) -->
      <div class="col-7 desktop-left q-px-xl q-pt-md q-pb-xl gt-sm">
        <div class="left-hero">
          <img
            :src="!$q.dark.isActive ? logoClaro : logoOscuro"
            alt="logo empresa"
            class="left-hero__logo"
          />
        </div>
      </div>

      <!-- LADO DERECHO: PANEL DE LOGIN -->
      <div class="col-12 col-md-5 flex flex-center">
        <div class="login-card bg-solid rounded-card shadow-2xl">
          <!-- Encabezado (versión mobile muestra logo arriba) -->
          <div class="text-center q-mt-sm q-mb-md">
            <img
              :src="!$q.dark.isActive ? logoClaro : logoOscuro"
              alt="logo empresa"
              class="top-logo lt-md"
            />
            <div class="brand-title">
              <span class="text-primary">FIRST</span
              ><span class="text-secondary">RED</span>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Enterprise Resource Planning
            </div>
          </div>

          <form @submit.prevent="login" class="q-mt-md">
            <!-- Usuario -->
            <q-input
              v-model="loginUser.name"
              label="Usuario"
              outlined
              dense
              class="q-mb-sm"
              @keyup.enter="login()"
            />

            <!-- Contraseña -->
            <q-input
              v-model="loginUser.password"
              label="Contraseña"
              outlined
              dense
              :type="isPwd ? 'password' : 'text'"
              class="q-mb-sm normal-text"
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

            <!-- Recuérdame -->
            <q-checkbox
              v-model="loginUser.remember_session"
              label="Recuérdame"
              class="q-mb-sm"
            />

            <!-- Botón principal -->
            <q-btn
              color="primary"
              label="Iniciar sesión"
              class="full-width q-mt-xs q-mb-md btn-primary-xl"
              :disabled="!enableLoginButton"
              no-caps
              unelevated
              @click="login()"
            />

            <!-- Divisor con “o” centrada -->
            <div class="or-divider q-my-md">
              <span>o</span>
            </div>

            <!-- Entrar como externo (outline) -->
            <q-btn
              color="secondary"
              label="¿Entrar como externo?"
              class="full-width q-mt-xs q-mb-md btn-primary-xl"
              no-caps
              unelevated
              :to="{ name: 'LoginPostulante' }"
            />

            <!-- Link inferior -->
            <div
              class="text-center q-mt-lg text-primary text-weight-medium"
              style="cursor: pointer"
              @click="recuperarPassword()"
            >
              ¿Olvidaste tu contraseña?
            </div>
          </form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script src="./LoginPage.ts"></script>

<style scoped>
/* ---------- COLUMNA IZQUIERDA (desktop) ---------- */
.left-hero {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}
.left-hero__logo {
  width: 520px;
  max-width: 100%;
  object-fit: contain;
  display: inline-block;
  filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.22));
}
.left-hero__tag {
  display: inline-block;
  margin-top: 8px;
  background: #f6c21a;
  padding: 6px 18px;
  border-radius: 6px;
  letter-spacing: 2px;
  font-weight: 700;
  color: #2b2b2b;
  font-size: 12px;
}

/* ---------- TARJETA LOGIN (derecha) ---------- */
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 28px 24px 24px;
}

/* logo pequeño en mobile (oculto en desktop) */
.top-logo {
  width: 92px;
  height: auto;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.18));
}

/* ---------- “FIRSTRED” TITULAR ---------- */
.brand-title {
  line-height: 1;
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 44px;
}

/* subtítulo ERP */
.text-caption {
  font-size: 14px;
}

/* ---------- BOTONES ---------- */
.btn-primary-xl {
  height: 44px;
  font-size: 16px;
  border-radius: 10px;
}

/* ---------- DIVISOR “o” ---------- */
.or-divider {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #9da3af;
  font-weight: 600;
  justify-content: center;
}
.or-divider::before,
.or-divider::after {
  content: '';
  flex: 1 1 auto;
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
}
.or-divider > span {
  display: inline-flex;
  width: 26px;
  height: 26px;
  border-radius: 99px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: white;
  text-transform: lowercase;
}

/* ---------- UTILIDADES / AJUSTES ---------- */
.rounded-card {
  border-radius: 18px;
}
.bg-solid {
  background: #ffffff;
}
.normal-text .q-field__native {
  text-transform: none !important;
}

/* ---------- BREAKPOINTS ---------- */
@media (min-width: 1024px) {
  .q-page {
    padding-left: 28px;
    padding-right: 28px;
  }
}
</style>
