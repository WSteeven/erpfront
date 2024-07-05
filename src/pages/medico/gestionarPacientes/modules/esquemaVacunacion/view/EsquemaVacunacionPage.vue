<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <div
        v-if="!mostrarEsquema"
        class="bg-desenfoque rounded q-pa-md row q-mb-md q-col-gutter-x-sm"
      >
        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Tipo de vacuna</label>
          <q-select
            v-model="esquema.tipo_vacuna"
            :options="tiposVacunas"
            @filter="filtrarTiposVacunas"
            transition-show="scale"
            transition-hide="scale"
            :disable="!habilitarTipoVacuna"
            options-dense
            dense
            outlined
            :option-label="(item) => item.nombre"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :error="!!v$.tipo_vacuna.$errors.length"
          >
            <template v-slot:error>
              <div v-for="error of v$.tipo_vacuna.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Fecha de aplicación</label>
          <q-input
            v-model="esquema.fecha"
            placeholder="Obligatorio"
            outlined
            :disable="disabled"
            type="datetime"
            :error="!!v$.fecha.$errors.length"
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="esquema.fecha" :mask="maskFecha" today-btn>
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
              <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-2 q-mb-md">
          <label class="q-mb-sm block">Lote</label>
          <q-input
            v-model="esquema.lote"
            placeholder="Opcional"
            outlined
            :disable="disabled"
            dense
          >
          </q-input>
        </div>

        <div class="col-12 col-md-1 q-mb-md">
          <label class="q-mb-sm block">&nbsp;</label>
          <q-checkbox
            v-model="esquema.es_dosis_unica"
            label="Es dosis única"
            :disable="disabled"
            outlined
            dense
          ></q-checkbox>
        </div>

        <div class="col-12 col-md-3 q-mb-md">
          <label class="q-mb-sm block">Fecha de caducidad</label>
          <q-input
            v-model="esquema.fecha_caducidad"
            placeholder="Opcional"
            outlined
            :disable="disabled"
            type="datetime"
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
                    v-model="esquema.fecha_caducidad"
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
          </q-input>
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-sm block"
            >Nombres completos del responsable de la vacunación</label
          >
          <q-input
            v-model="esquema.responsable_vacunacion"
            placeholder="Obligatorio"
            outlined
            :disable="disabled"
            :error="!!v$.responsable_vacunacion.$errors.length"
            dense
          >
            <template v-slot:error>
              <div
                v-for="error of v$.responsable_vacunacion.$errors"
                :key="error.$uid"
              >
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-sm block"
            >Establecimiento de salud donde se colocó la vacuna</label
          >
          <q-input
            v-model="esquema.establecimiento_salud"
            placeholder="Obligatorio"
            outlined
            :disable="disabled"
            dense
            :error="!!v$.establecimiento_salud.$errors.length"
          >
            <template v-slot:error>
              <div
                v-for="error of v$.establecimiento_salud.$errors"
                :key="error.$uid"
              >
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-sm block">Dosis administradas</label>
          <div class="q-gutter-sm">
            <q-radio
              v-for="dosis in totalDosis"
              :key="dosis"
              v-model="esquema.dosis_aplicadas"
              :val="dosis"
              :label="`Dosis ${dosis}`"
            />
          </div>
        </div> -->

        <div class="col-12 q-mb-md">
          <label class="q-mb-sm block">Observación</label>
          <q-input
            v-model="esquema.observacion"
            placeholder="Opcional"
            :disable="disabled"
            outlined
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <!-- Manejo de archivos -->
        <div class="col-12 q-mb-md">
          <gestor-archivos
            ref="refArchivo"
            label="Adjuntar archivos"
            :mixin="mixin"
            :disable="disabled"
            :listarAlGuardar="false"
            :permitir-eliminar="
              accion == acciones.nuevo || accion == acciones.editar
            "
            :idModelo="idEsquema"
          >
          </gestor-archivos>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <essential-table
            v-if="mostrarEsquema"
            titulo="Esquema de vacunación"
            :configuracionColumnas="
              configuracionColumnasEsquemaVacunacionDetallado
            "
            :datos="listado"
            :alto-fijo="false"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :mostrar-footer="false"
            :mostrar-botones="false"
          ></essential-table>
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./EsquemaVacunacionPage.ts"></script>
