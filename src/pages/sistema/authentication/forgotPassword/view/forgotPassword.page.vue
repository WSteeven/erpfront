<template>
  <q-page class="bg-white my-font">
    <div class="row items-stretch justify-between q-px-md q-px-xl-md">

      <!-- ===== IZQUIERDA (solo PC) ===== -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-6 gt-sm flex flex-center window-height"
      >
        <div class="hero-left">
          <img
            :src="!$q.dark.isActive ? logoClaro : logoOscuro"
            alt="logo grande"
            class="hero-logo"
          />
        </div>
      </div>

      <!-- ===== DERECHA ===== -->
      <div class="col-12 col-md-6 flex flex-center window-height">
        <!-- Wrapper para centrar verticalmente todo el contenido derecho -->
        <div class="right-wrap">

          <!-- Encabezado -->
          <div class="text-center q-mb-md">
            <!-- Logo pequeño en mobile -->
            <img
              v-if="$q.screen.xs || $q.screen.sm"
              :src="!$q.dark.isActive ? logoClaro : logoOscuro"
              alt="logo pequeño"
              class="top-logo"
            />
            <div class="brand-title">
              <span class="text-primary">FIRST</span><span class="text-secondary">RED</span>
            </div>
            <div class="text-bold text-grey-13">Enterprise Resource Planning</div>
          </div>

          <!-- CARD -->
          <div class="fp-card bg-white rounded-card">
            <form @submit.prevent="enviarCorreoRecuperacion" class="q-px-lg q-pt-lg q-pb-md">

              <!-- Divisor -->
              <div class="or-divider q-my-md">
                <span>Recupera tu cuenta</span>
              </div>

              <!-- EMAIL -->
              <div class="col-12 q-mb-sm" v-if="!enviando">
                <q-input
                  v-model="forgotPassword.email"
                  label="EMAIL"
                  type="email"
                  hint="Ingrese el correo electrónico con el que se registró"
                  outlined
                  dense
                  class="field-44 input-soft"
                />
              </div>

              <!-- CÓDIGO -->
              <div class="col-12 q-mb-sm" v-if="enviando">
                <q-input
                  v-model="forgotPassword.code"
                  label="CÓDIGO"
                  hint="Ingrese el código enviado a su correo institucional"
                  outlined
                  dense
                  class="field-44 input-soft"
                />
              </div>

              <!-- CONTRASEÑA NUEVA -->
              <div class="col-12 q-mb-sm" v-if="enviando">
                <q-input
                  v-model="forgotPassword.password"
                  label="CONTRASEÑA NUEVA"
                  outlined
                  dense
                  :type="isPwd ? 'password' : 'text'"
                  hint="No comparta su contraseña con nadie"
                  class="field-44 input-soft"
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

              <!-- CONFIRMAR -->
              <div class="col-12 q-mb-sm" v-if="enviando">
                <q-input
                  v-model="forgotPassword.password_confirmation"
                  label="CONFIRMAR CONTRASEÑA"
                  outlined
                  dense
                  :type="isPwdconfirm ? 'password' : 'text'"
                  hint="Por favor confirme su contraseña"
                  class="field-44 input-soft"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwdconfirm ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwdconfirm = !isPwdconfirm"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Tengo un código -->
              <div class="col-12 flex justify-end q-mb-sm" v-if="mostrarTengoUnCodigo">
                <a
                  class="text-primary cursor-pointer link-underline"
                  @click="() => { enviando = true; mostrarTengoUnCodigo = false }"
                >
                  ¿Tengo un código?
                </a>
              </div>

              <!-- Botones -->
              <div class="col-12" v-if="!enviando">
                <q-btn
                  color="primary"
                  label="Enviar código de recuperación"
                  class="full-width btn-44 bg-secondary text-white q-mb-sm"
                  :disabled="!enableLoginButton"
                  no-caps
                  unelevated
                  @click="enviarCorreoRecuperacion()"
                />
                <q-btn
                  color="primary"
                  label="Volver al inicio de sesión"
                  class="full-width link-underline q-mt-xs"
                  no-caps
                  flat
                  :to="{ name: 'Login' }"
                />
              </div>

              <div class="col-12" v-if="enviando">
                <q-btn
                  label="Recuperar Cuenta"
                  class="full-width btn-44  bg-secondary text-white q-mb-sm"
                  :disabled="!enableRecoveryPasswordButton"
                  no-caps
                  unelevated
                  @click="recuperacionCuenta()"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- /DERECHA -->
    </div>
  </q-page>
</template>

<script lang="ts" src="./forgotPassword.page.ts"></script>

<style scoped>
/* ===== PC: logo grande izquierda ===== */
.hero-left{ max-width:520px; margin:0 auto; }
.hero-logo{
  width:560px; max-width:100%; display:block;
  filter: drop-shadow(0 10px 30px rgba(0,0,0,.18));
}

/* ===== Contenido derecho centrado vertical ===== */
.right-wrap{
  width:100%;
  max-width:520px;            /* mismo ancho que la card */
  display:flex;
  flex-direction:column;
  justify-content:center;     /* centra vertical */
}

/* ===== Mobile: logo pequeño ===== */
.top-logo{ width:92px; height:auto; margin-bottom:6px; }

/* ===== Encabezado FIRSTRED ===== */
.brand-title {
  line-height: 1;
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 44px;
}
.text-grey-13 { color:#7f8a97 !important; }

/* ===== Divisor ===== */
.or-divider {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6b6b6b;
  font-weight: 600;
  justify-content: center;
}
.or-divider::before,
.or-divider::after {
  content: "";
  flex: 1 1 auto;
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
}
.or-divider > span {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: white;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

/* ===== Card ===== */
.fp-card{
  width:100%; max-width:520px; margin:0 auto;
  border-radius:18px;
}

/* ===== Inputs ===== */
.field-44 .q-field__control{ min-height:46px; border-radius:10px; }
.input-soft .q-field__control{ background:#eaf2ff; border:1px solid #e3e7ef; }
.input-soft .q-field__label{ letter-spacing:.5px; }

/* ===== Botones ===== */
.btn-44{ height:48px; border-radius:14px; font-size:16px; }
.btn-primary-pill:hover{ filter:brightness(.98); }
.link-underline{ text-decoration: underline; text-underline-offset: 3px; }

/* ===== Responsive ===== */
@media (max-width: 1023px){
  .hero-left{ display:none; }
  .brand-title{ font-size:36px; }
  .right-wrap{ max-width:520px; } /* mantiene buen ancho en mobile */
}
</style>
