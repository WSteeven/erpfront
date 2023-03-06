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
            <!-- Usuarios -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Usuario</label>
          <q-select v-model="fondo_rotativo_contabilidad.usuario" :options="usuarios" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.usuario.$errors.length" error-message="Debes seleccionar un usuario" use-input input-debounce="0"
            @filter="filtrarUsuarios" :option-value="(v) => v.usuario_id" :option-label="(v) => v.nombres + ' ' + v.apellidos"
            emit-value map-options>
            <template v-slot:error>
              <div v-for="error of v$.usuario.$errors" :key="error.$uid">
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
          <!-- Fecha Inicio -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Fecha Inicio:</label>
            <q-input v-model="fondo_rotativo_contabilidad.fecha_inicio" placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length" :disable="disabled" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fondo_rotativo_contabilidad.fecha_inicio" mask="DD-MM-YYYY" today-btn>
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
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Fecha Fin:</label>
            <q-input v-model="fondo_rotativo_contabilidad.fecha_fin" placeholder="Obligatorio"
              :error="!!v$.fecha_fin.$errors.length" :disable="disabled" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fondo_rotativo_contabilidad.fecha_fin" mask="DD-MM-YYYY" today-btn>
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
        </q-card-section>

        <q-separator></q-separator>

        <q-card-actions align="around">
          <q-btn  color="positive"   @click="abrir_reporte(fondo_rotativo_contabilidad)">Aceptar</q-btn></q-card-actions>
      </q-card>
      {{ listado }}
  </q-page>

</template>
<script src="./Reporte_contabilidadPage.ts"></script>
