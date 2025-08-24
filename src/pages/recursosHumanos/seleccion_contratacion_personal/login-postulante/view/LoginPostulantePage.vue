<template>
    <q-page class="bg-white my-font">
        <div class="row items-center justify-between q-px-md q-px-xl-md q-pt-xl q-pb-lg">
            <!-- ===== IZQUIERDA (solo PC) ===== -->
            <div class="col-6 gt-sm">
                <div class="hero-left">
                    <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" alt="logo grande" class="hero-logo" />
                </div>
            </div>

            <!-- ===== DERECHA ===== -->
            <div class="col-12 col-md-6">
                <!-- ***** BLOQUE LOGO + ENCABEZADO ***** -->
                <!-- En móvil mostramos logo pequeño y luego el encabezado -->
                <div class="text-center q-mb-md">
                    <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" alt="logo pequeño" class="top-logo lt-md" />
                    <div class="brand-title">
                        <span class="text-primary">FIRST</span><span class="text-secondary">RED</span>
                    </div>
                    <div class="text-bold text-grey-13">Enterprise Resource Planning</div>
                </div>

                <!-- ***** FORM CARD ***** -->
                <div class="postu-card bg-white rounded-card">
                    <form @submit.prevent="login" class="q-px-lg">
                        <!-- Social -->
                        <q-btn class="full-width btn-pill btn-google q-mb-sm" no-caps unelevated
                            @click="loginWithProvider('google')">
                            <div class="btn-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#EA4335"
                                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.66 30.47 0 24 0 14.62 0 6.51 5.35 2.56 13.11l7.98 6.2C12.43 13.02 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4"
                                        d="M46.5 24.5c0-1.57-.14-3.08-.4-4.5H24v9h12.7c-.55 2.84-2.22 5.24-4.7 6.86l7.19 5.56C43.76 37.17 46.5 31.32 46.5 24.5z" />
                                    <path fill="#FBBC05"
                                        d="M10.54 28.31c-.5-1.48-.78-3.06-.78-4.81s.28-3.33.78-4.81l-7.98-6.2C1.89 15.42 1 19.61 1 23.5s.89 8.08 2.56 11.21l7.98-6.2z" />
                                    <path fill="#34A853"
                                        d="M24 47c6.48 0 11.93-2.13 15.9-5.8l-7.19-5.56c-2.03 1.37-4.62 2.16-8.71 2.16-6.26 0-11.57-3.52-13.46-8.81l-7.98 6.2C6.51 42.65 14.62 47 24 47z" />
                                </svg>
                                <span>Ingrese con Google</span>
                            </div>
                        </q-btn>

                        <q-btn class="full-width btn-pill btn-facebook q-mb-sm bg-info text-white" no-caps unelevated icon="bi-facebook"
                            label="Ingrese con Facebook" @click="loginWithProvider('facebook')" />

                        <!-- Divisor -->
                        <div class="or-divider q-my-md">
                            <span>O ingresa con tu usuario</span>
                        </div>

                        <!-- Inputs -->
                        <q-input v-model="loginUser.name" label="CORREO" type="email" outlined dense
                            class="field-44 input-soft q-mb-sm" @keyup.enter="login()" />
                        <q-input v-model="loginUser.password" label="CONTRASEÑA" outlined dense
                            :type="isPwd ? 'password' : 'text'" class="field-44 input-soft q-mb-xs"
                            hint="NO COMPARTA SU CONTRASEÑA CON NADIE" @keyup.enter="login()">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>

                        <!-- CTA principal -->
                        <q-btn  label="Iniciar sesión"
                            class="full-width btn-44 btn-primary-pill q-mt-sm q-mb-md bg-secondary text-white" :disabled="!enableLoginButton"
                            no-caps unelevated @click="login()" />

                        <!-- Recuperar -->
                        <div class="text-center q-mb-lg">
                            <q-btn flat color="primary" label="Recuperar contraseña" class="link-underline" no-caps
                                unelevated @click="recuperarPassword()" />
                        </div>

                        <!-- Registro -->
                        <div class="row items-center q-mt-none q-mb-md">
                            <div class="col-12 col-sm-7 text-center text-sm-right q-my-sm q-pr-sm">
                                <small>¿Quieres ser parte de JP CONSTRUCRED?</small>
                            </div>
                            <div class="col-12 col-sm-5">
                                <q-btn flat color="primary" label="Regístrate" class="full-width link-underline" no-caps
                                    unelevated @click="registro()" />
                            </div>
                        </div>

                        <!-- Botón dorado outline -->
                        <q-btn label="¿Entrar como empleado?" class="full-width btn-44 btn-outline-gold" no-caps outline
                            to="/login" />
                    </form>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script src="./LoginPostulantePage.ts"></script>

<style scoped>
/* ===== PC: logo grande a la izquierda ===== */
.hero-left {
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
}

.hero-logo {
    width: 560px;
    max-width: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.18));
}

/* ===== Mobile: logo pequeño arriba ===== */
.top-logo {
    width: 96px;
    height: auto;
    margin-bottom: 6px;
}

/* ===== Card derecha ===== */

.brand-title {
    line-height: 1;
    font-weight: 800;
    letter-spacing: 1px;
    font-size: 44px;
}

.postu-card {
    width: 100%;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
}

/* ===== Inputs ===== */
.field-44 .q-field__control {
    min-height: 46px;
    border-radius: 10px;
}

.input-soft .q-field__control {
    background: #eaf2ff;
    border: 1px solid #e3e7ef;
}

.input-soft .q-field__label {
    letter-spacing: 0.5px;
}

/* ===== Botones ===== */
.btn-44 {
    height: 48px;
    border-radius: 14px;
    font-size: 16px;
}

/* Sociales */
.btn-pill {
    border-radius: 14px;
    height: 48px;
    font-size: 16px;
}

.btn-pill .q-icon {
    font-size: 20px;
    margin-right: 8px;
}

.btn-google {
    background: #fff;
    color: #1f1f1f;
    border: 1px solid #e8e8e8;
    display: flex;
    justify-content: center;
}

.btn-google:hover {
    filter: brightness(0.98);
}

.btn-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-facebook {
    display: flex;
    justify-content: center;
}

/* CTA principal */

.btn-primary-pill:hover {
    filter: brightness(0.98);
}

/* ===== Divisor ===== */
.or-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    color: #a3a3a3;
    font-weight: 600;
}

.or-divider::before,
.or-divider::after {
    content: '';
    flex: 1 1 auto;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
}

.or-divider>span {
    padding: 8px 14px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    color: #6b6b6b;
    font-size: 12px;
}

/* ===== Responsive ===== */
@media (max-width: 1023px) {

    /* tablets/móviles: ocultamos la columna izquierda */
    .hero-left,
    .hero-underline {
        display: none;
    }

    .brand-title {
        font-size: 36px;
    }
}
</style>
