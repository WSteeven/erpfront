<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Descuentos generales"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del Descuento</label>
            <q-input
              v-model="descuentos_generales.nombre"
              @update:model-value="
                v => (descuentos_generales.nombre = removeAccents(v))
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
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Abreviatura del Descuento</label>
            <q-input
              v-model="descuentos_generales.abreviatura"
              @update:model-value="
                v => (descuentos_generales.abreviatura = removeAccents(v))
              "
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.abreviatura.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="abreviatura" :v$="v$" />
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./DescuentosGeneralesPage.ts"></script>
