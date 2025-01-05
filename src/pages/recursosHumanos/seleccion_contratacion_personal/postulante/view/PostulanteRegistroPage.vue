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
            <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" alt="logo" />
          </q-avatar>
        </div>
      </div>

      <!-- Right side -->
      <div
        class="col-12 col-md-4 column items-center bg-body-table justify-center window-height"
      >
        <q-avatar
          v-if="$q.screen.xs"
          square
          size="120px"
          class="q-mx-auto block q-mb-md"
        >
          <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" alt="logo" />
        </q-avatar>

        <form @submit.prevent class="full-width q-px-lg">
          <div class="q-mb-sm">
            <h2 class="text-bold">Registro de Postulante</h2>
          </div>
          <div class="q-mb-sm">
            <p>
              Que bueno volverte a ver otra vez. Anímate a ser parte de nuestro
              equipo
            </p>
          </div>
          <!-- Nombres -->
          <div class="col-12 q-mb-sm">
            <label class="q-mb-sm block">Nombres</label>
            <q-input
              v-model="postulante.nombres"
              placeholder="Obligatorio"
              :error="!!v$.nombres.$errors.length"
              @blur="v$.nombres.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombres.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Apellidos -->
          <div class="col-12 q-mb-sm">
            <label class="q-mb-sm block">Apellidos</label>
            <q-input
              v-model="postulante.apellidos"
              placeholder="Obligatorio"
              :error="!!v$.apellidos.$errors.length"
              @blur="v$.apellidos.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.apellidos.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Fecha nacimiento -->
          <div class="col-12 q-mb-sm">
            <label class="q-mb-sm block">Fecha de nacimiento</label>
            <q-input
              v-model="postulante.fecha_nacimiento"
              placeholder="Obligatorio"
              :error="!!v$.fecha_nacimiento.$errors.length"
              @blur="v$.fecha_nacimiento.$touch"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="postulante.fecha_nacimiento"
                      :mask="maskFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div
                  style="clear: inherit"
                  v-for="error of v$.fecha_nacimiento.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>


          <!-- Tipo de Identificacion -->
          <div class="col-12 q-mb-sm">
            <label class="q-mb-sm block">Tipo de Identificacion</label>
            <q-select
              v-model="postulante.tipo_documento_identificacion"
              :options="tiposDocumentosIdentificaciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              :error="!!v$.tipo_documento_identificacion.$errors.length"
              @blur="v$.tipo_documento_identificacion.$touch"
              :option-value="(v) => v.value"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_documento_identificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Numero de Identificacion -->
          <div class="col-12 q-mb-sm">
            <label class="q-mb-sm block">Número de Identificación</label>
            <q-input
              v-model="postulante.numero_documento_identificacion"
              placeholder="Obligatorio"
              :error="!!v$.numero_documento_identificacion.$errors.length"
              @blur="v$.numero_documento_identificacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.numero_documento_identificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Telefono -->
          <div class="col-12 q-mb-sm">
            <label class="q-mb-sm block">Telefono</label>
            <q-input
              v-model="postulante.telefono"
              type="tel"
              placeholder="Obligatorio"
              :error="!!v$.telefono.$errors.length"
              @blur="v$.telefono.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.telefono.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Email -->
          <div class="col-12 q-mb-sm">
            <label class="q-mb-sm block">Email</label>
            <q-input
              v-model="postulante.email"
              type="email"
              placeholder="Obligatorio"
              :error="!!v$.email.$errors.length"
              @blur="v$.email.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.email.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Contraseña -->
          <div class="col-12 q-mb-sm">
            <label class="q-mb-sm block">Contraseña</label>

            <q-input
              v-model="postulante.password"
              outlined
              dense
              @blur="v$.password.$touch"
              :error="!!v$.password.$errors.length"
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
              <template v-slot:error>
                <div v-for="error of v$.password.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <!-- Botones -->
            <q-btn
              color="primary"
              label="Registrarse"
              class="full-width q-mb-sm"
              no-caps
              unelevated
              :disable="enableLoginButton"
              @click="registro()"
            >
            </q-btn>
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>
<script src="./PostulanteRegistroPage.ts"></script>
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
