<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Prestamo Hipotecario"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <!-- Mes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Mes</label>
            <q-input
              v-model="extensionconyugal.mes"
              placeholder="Obligatorio"
              :value="extensionconyugal.mes"
              @click="$refs.monthPicker.show()"
              mask="##-####"
              :error="!!v$.mes.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.mes.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="is_month"
                  >
                    <q-date
                      v-model="extensionconyugal.mes"
                      minimal
                      mask="MM-YYYY"
                      emit-immediately
                      default-view="Years"
                      @update:model-value="checkValue"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.mes.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Empleado</label>
            <q-input v-model="extensionconyugal.empleado_info" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Dependiente</label>
            <q-input v-model="extensionconyugal.dependiente_info" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Origen</label>
            <q-input v-model="extensionconyugal.origen" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Materia Grabada</label>
            <q-input v-model="extensionconyugal.materia_grabada" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Aporte</label>
            <q-input v-model="extensionconyugal.aporte" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">% Aporte</label>
            <q-input v-model="extensionconyugal.aporte_porcentaje" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <!-- Documento -->
          <div class="col-12 col-md-3" v-if="esNuevo">
            <label class="q-mb-sm block">Planilla</label>
            <gestor-documentos
              ref="refArchivoExtensionConyugal"
              :mixin="mixinExtensionConyugal"
              :endpoint="endpoint"
              :disable="!esNuevo"
              :permitir-eliminar="false"
              :listar-al-guardar="false"
              :esMultiple="false"
            >
            </gestor-documentos>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./ExtensionConyugalPage.ts"></script>
