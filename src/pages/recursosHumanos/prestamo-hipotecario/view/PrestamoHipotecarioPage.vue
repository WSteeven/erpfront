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
              v-model="prestamo.mes"
              placeholder="Obligatorio"
              :value="prestamo.mes"
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
                      v-model="prestamo.mes"
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
            <q-input v-model="prestamo.empleado_info" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">NUT</label>
            <q-input v-model="prestamo.nut" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Valor</label>
            <q-input v-model="prestamo.valor" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <!-- Documento -->
          <div class="col-12 col-md-3"  v-if="esNuevo">
            <label class="q-mb-sm block">Planilla</label>
            <gestor-documentos
              ref="refArchivoPrestamoHipotecario"
              :mixin="mixinPrestamoHipotecario"
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
<script src="./PrestamoHipotecarioPage.ts"></script>
