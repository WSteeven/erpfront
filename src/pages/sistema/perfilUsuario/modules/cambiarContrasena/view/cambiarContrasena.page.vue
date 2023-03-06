<template>
  <q-page padding>
    <q-card flat bordered class="my-card bg-grey-1  ">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Generar Reporte Fondo Rotativo Contabilidad</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Usuarios -->
          <div class="col-12 col-md-2 q-mb-md">
            <label class="q-mb-sm block">Contraseña actua</label>
            <q-input v-model="cambiarContrasena.current_password" placeholder="Obligatorio"
              :error="!!v$.current_password.$errors.length" :disable="disabled" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="cambiarContrasena.current_password" mask="DD-MM-YYYY" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.current_password.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha Inicio -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Fecha Inicio:</label>
            <q-input v-model="cambiarContrasena.fecha_inicio" placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length" :disable="disabled" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="cambiarContrasena.fecha_inicio" mask="DD-MM-YYYY" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha Fin -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Fecha Fin:</label>
            <q-input v-model="cambiarContrasena.fecha_fin" placeholder="Obligatorio"
              :error="!!v$.fecha_fin.$errors.length" :disable="disabled" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="cambiarContrasena.fecha_fin" mask="DD-MM-YYYY" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-4 col-md-2 q-mb-md" style="margin-top: 2%;">
            <q-btn color="positive" @click="abrir_reporte(cambiarContrasena)"><q-icon size="xs" class="q-mr-sm"
                name="bi-search" /></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>

</template>
<script src="./Reporte_contabilidadPage.ts"></script>
