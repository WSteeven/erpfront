<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Conceptos de Ingreso"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-5">
            <label class="q-mb-sm block">Nombre del Ingreso</label>
            <q-input
              v-model="concepto_ingreso.nombre"
              @update:model-value="
                v => (concepto_ingreso.nombre = removeAccents(v))
              "
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- abreviatura -->
          <div class="col-12 col-md-5">
            <label class="q-mb-sm block">Abreviatura del Descuento</label>
            <q-input
              v-model="concepto_ingreso.abreviatura"
              @update:model-value="
                v => (concepto_ingreso.abreviatura = removeAccents(v))
              "
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.abreviatura.$errors.length"
              outlined
              dense
            >
              <error-component clave="abreviatura" :v$="v$" />
            </q-input>
          </div>

          <!-- Calculable IEES -->
          <div class="col-12 col-md-2">
            <label class="q-mb-sm block">Calculable IEES</label>
            <q-toggle
              :label="concepto_ingreso.calculable_iess ? 'SI' : 'NO'"
              v-model="concepto_ingreso.calculable_iess"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./ConceptoIngresoPage.ts"></script>
