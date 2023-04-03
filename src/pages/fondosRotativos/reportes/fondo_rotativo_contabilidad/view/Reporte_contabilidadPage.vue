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
            <label class="q-mb-sm block">Empleado</label>
            <q-select v-model="fondo_rotativo_contabilidad.usuario" :options="usuarios" transition-show="jump-up"
              transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
              :error="!!v$.usuario.$errors.length" error-message="Debes seleccionar un usuario" use-input
              input-debounce="0" @filter="filtrarUsuarios" :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos" emit-value map-options>
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
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Fecha Inicio:</label>
            <q-input v-model="fondo_rotativo_contabilidad.fecha_inicio" placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length" :disable="disabled" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fondo_rotativo_contabilidad.fecha_inicio" :mask="maskFecha" today-btn>
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
            <q-input v-model="fondo_rotativo_contabilidad.fecha_fin" placeholder="Obligatorio"
              :error="!!v$.fecha_fin.$errors.length" :disable="disabled" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fondo_rotativo_contabilidad.fecha_fin" :mask="maskFecha" today-btn>
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
            <q-btn color="positive" @click="abrir_reporte(fondo_rotativo_contabilidad)"><q-icon size="xs" class="q-mr-sm"
                name="bi-search" /></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <essential-table v-if="listado.length > 0" titulo="Reporte de Contabilidad"
      :configuracionColumnas="[...ConfiguracionColumnasContabilidad,accionesTabla]"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :accion1="botonVerModalGasto">
    </essential-table>
    <modal-entidad
    :comportamiento="modales"
    >

    </modal-entidad>
  </q-page>

</template>
<script src="./Reporte_contabilidadPage.ts"></script>
