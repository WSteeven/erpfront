<template>
<tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="true"
    :tabOptions="tabOptionsEstadosAlimentacion"
    :accion1="btnCashAlimentacion"
    :accion2="btnImprimirReporteAlimentacion"
    :accion3="btnFinalizar"
    :full="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :filtrar="filtrarAlimentacion"
    :tabDefecto="estadosAlimentacion.activa"
  >
  <template #formulario>
    <q-form @submit.prevent>
    <div class="row q-col-gutter-sm q-py-md">
      <!-- Mes -->
         <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Mes</label>
        <q-input
        v-model="alimentacion.mes"
        placeholder="Obligatorio" 
        :error="!!v$.mes.$errors.length"
          :disable="accion == 'CONSULTAR' || accion == 'EDITAR'"
                    @blur="v$.mes.$touch"

        outlined dense readonly>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                v-model="is_month"
              >
                <q-date
                   v-model="alimentacion.mes"
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
        </q-input>
      </div>
      <!-- Nombre -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Nombre</label>
        <q-input
          v-model="alimentacion.nombre"
          placeholder="Obligatorio"
          disable
          type="textarea"
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Aceptar Sugerencias -->
      <div class="col-12 col-md-3">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="alimentacion.es_quincena"
          label="Es quincena"
          :disable="disabled"
          @update:model-value="obtenerNombreMes"
          outlined
          dense
        ></q-checkbox>
      </div>
    </div>
  </q-form>
  </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./AlimentacionPage.ts"></script>
