<template>
  <q-page class="bg-white my-font">
    <div class="row items-stretch justify-between q-px-md q-px-xl-md">

      <!-- ===== IZQUIERDA (solo PC) ===== -->
      <div
        v-if="!$q.screen.xs && !$q.screen.sm"
        class="col-6 gt-sm flex flex-center window-height"
      >
        <div class="hero-left">
          <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" alt="logo grande" class="hero-logo" />
        </div>
      </div>

      <!-- ===== DERECHA ===== -->
      <div class="col-12 col-md-6 flex flex-center window-height">
        <div class="right-wrap">

          <!-- Encabezado -->
          <div class="text-center q-mb-md">
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

          <!-- Divisor estilo chip -->
          <div class="or-divider q-mb-md">
            <span>Registro de Postulante</span>
          </div>

          <!-- CARD -->
          <div class="reg-card bg-white rounded-card">
            <form @submit.prevent class="q-px-lg q-pt-lg q-pb-md">

              <p class="form-lead q-mb-md text-block">
                ¡Qué bueno volverte a ver! Anímate a ser parte de nuestro equipo.
              </p>

              <!-- ===== Fila: Nombres / Apellidos (grandes) ===== -->
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-6">
                  <label class="label label-lg">Nombres</label>
                  <q-input
                    v-model="postulante.nombres"
                    placeholder="Obligatorio"
                    :error="!!v$.nombres.$errors.length"
                    @blur="v$.nombres.$touch"
                    outlined
                    dense
                    class="field-52 input-soft input-lg"
                  >
                    <template v-slot:error>
                      <div v-for="error of v$.nombres.$errors" :key="error.$uid" class="error-msg">{{ error.$message }}</div>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-6">
                  <label class="label label-lg">Apellidos</label>
                  <q-input
                    v-model="postulante.apellidos"
                    placeholder="Obligatorio"
                    :error="!!v$.apellidos.$errors.length"
                    @blur="v$.apellidos.$touch"
                    outlined
                    dense
                    class="field-52 input-soft input-lg"
                  >
                    <template v-slot:error>
                      <div v-for="error of v$.apellidos.$errors" :key="error.$uid" class="error-msg">{{ error.$message }}</div>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Fecha de nacimiento (más pequeña) -->
              <div class="q-mt-sm">
                <label class="label label-sm">Fecha de nacimiento</label>
                <q-input
                  v-model="postulante.fecha_nacimiento"
                  placeholder="Obligatorio"
                  :error="!!v$.fecha_nacimiento.$errors.length"
                  @blur="v$.fecha_nacimiento.$touch"
                  readonly
                  outlined
                  dense
                  class="field-44 input-soft"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="postulante.fecha_nacimiento" :mask="maskFecha" today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:error>
                    <div v-for="error of v$.fecha_nacimiento.$errors" :key="error.$uid" class="error-msg">{{ error.$message }}</div>
                  </template>
                </q-input>
              </div>

              <!-- ===== Fila: Tipo doc / Número doc ===== -->
              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-12 col-md-6">
                  <label class="label">Tipo de Identificación</label>
                  <q-select
                    v-model="postulante.tipo_documento_identificacion"
                    :options="tiposDocumentosIdentificaciones"
                    transition-show="jump-up"
                    transition-hide="jump-down"
                    options-dense
                    dense
                    outlined
                    use-input
                    :input-debounce="0"
                    :error="!!v$.tipo_documento_identificacion.$errors.length"
                    @blur="v$.tipo_documento_identificacion.$touch"
                    :option-value="v => v.value"
                    :option-label="v => v.nombre"
                    emit-value
                    map-options
                    class="field-44 input-soft"
                  >
                    <template v-slot:error>
                      <div v-for="error of v$.tipo_documento_identificacion.$errors" :key="error.$uid" class="error-msg">{{ error.$message }}</div>
                    </template>
                    <template v-slot:no-option>
                      <q-item><q-item-section class="text-grey">No hay resultados</q-item-section></q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="label">Número de Identificación</label>
                  <q-input
                    v-model="postulante.numero_documento_identificacion"
                    placeholder="Obligatorio"
                    :error="!!v$.numero_documento_identificacion.$errors.length"
                    @blur="v$.numero_documento_identificacion.$touch"
                    outlined
                    dense
                    class="field-44 input-soft"
                  >
                    <template v-slot:error>
                      <div v-for="error of v$.numero_documento_identificacion.$errors" :key="error.$uid" class="error-msg">{{ error.$message }}</div>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- ===== Fila: Teléfono / Email ===== -->
              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-12 col-md-6">
                  <label class="label">Teléfono</label>
                  <q-input
                    v-model="postulante.telefono"
                    type="tel"
                    placeholder="Obligatorio"
                    :error="!!v$.telefono.$errors.length"
                    @blur="v$.telefono.$touch"
                    outlined
                    dense
                    class="field-44 input-soft"
                  >
                    <template v-slot:error>
                      <div v-for="error of v$.telefono.$errors" :key="error.$uid" class="error-msg">{{ error.$message }}</div>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-6">
                  <label class="label">Email</label>
                  <q-input
                    v-model="postulante.email"
                    type="email"
                    placeholder="Obligatorio"
                    :error="!!v$.email.$errors.length"
                    @blur="v$.email.$touch"
                    outlined
                    dense
                    class="field-44 input-soft"
                  >
                    <template v-slot:error>
                      <div v-for="error of v$.email.$errors" :key="error.$uid" class="error-msg">{{ error.$message }}</div>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Contraseña -->
              <div class="q-mt-sm">
                <label class="label">Contraseña</label>
                <q-input
                  v-model="postulante.password"
                  outlined
                  dense
                  @blur="v$.password.$touch"
                  :error="!!v$.password.$errors.length"
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
                  <template v-slot:error>
                    <div v-for="error of v$.password.$errors" :key="error.$uid" class="error-msg">{{ error.$message }}</div>
                  </template>
                </q-input>
              </div>

              <!-- Botón -->
              <div class="q-mt-md">
                <q-btn
                  color="primary"
                  label="Registrarse"
                  class="full-width btn-44 bg-secondary text-white q-mb-xs"
                  no-caps
                  unelevated
                  :disable="enableLoginButton"
                  @click="registro()"
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

<script src="./PostulanteRegistroPage.ts"></script>

<style scoped>
/* ===== IZQUIERDA ===== */
.hero-left{ max-width:560px; margin:0 auto; }
.hero-logo{
  width:560px; max-width:100%; display:block;
  filter: drop-shadow(0 10px 30px rgba(0,0,0,.18));
}

/* ===== DERECHA (centrado vertical) ===== */
.right-wrap{
  width:100%;
  max-width:620px;
  display:flex;
  flex-direction:column;
  justify-content:center;
}

/* Branding */
.top-logo{ width:92px; height:auto; margin-bottom:6px; }
.brand-title{ line-height:1; font-weight:800; letter-spacing:1px; font-size:42px; }
.text-grey-13{ color:#7f8a97 !important; }

/* Divisor chip */
.or-divider{
  display:flex; align-items:center; gap:14px; color:#6b6b6b; font-weight:600; justify-content:center;
}
.or-divider::before, .or-divider::after{
  content:""; flex:1 1 auto; height:1px; background:rgba(0,0,0,.12);
}
.or-divider>span{
  padding:8px 14px; border-radius:999px; border:1px solid rgba(0,0,0,.12); background:#fff;
  font-size:13px; font-weight:600;
}

/* Card */
.reg-card{
  width:100%; max-width:620px; margin:0 auto;
  border-radius:18px;
}
.form-lead{ color:#4b5563; font-size:14px; }

/* Labels & Inputs */
.label{ display:block; margin-bottom:6px; font-size:12.5px; letter-spacing:.4px; color:#6b7280; font-weight:700; }
.label-lg{ font-size:14.5px; }              /* Nombres/Apellidos más grande */
.label-sm{ font-size:12px; }                /* Fecha de nacimiento más pequeña */

.field-44 .q-field__control{ min-height:46px; border-radius:10px; }
.field-52 .q-field__control{ min-height:52px; border-radius:12px; }   /* campos grandes */
.input-lg .q-field__native{ font-size:16px; }                         /* texto más grande en los grandes */
.input-soft .q-field__control{ background:#eaf2ff; border:1px solid #e3e7ef; }
.input-soft .q-field__label{ letter-spacing:.5px; }

.error-msg{ color:#d14343; font-size:12px; }

/* Botones */
.btn-44{ height:48px; border-radius:14px; font-size:16px; }
.btn-primary-pill:hover{ filter:brightness(.98); }

/* Responsive */
@media (max-width: 1023px){
  .hero-left{ display:none; }
  .brand-title{ font-size:36px; }
  .right-wrap, .reg-card{ max-width:520px; }
}
</style>
