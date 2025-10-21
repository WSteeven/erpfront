<template>
  <div>
    <q-page class="flex flex-center">
      <q-card flat bordered class="my-card bg-grey-1">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">Anular Gastos por id</div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">ID</label>
              <q-input
                v-model="gasto.id"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.id.$errors.length"
                @blur="v$.id.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="id" :v$="v$" />
                </template>
              </q-input>
            </div>

            <!-- Descripcion -->
            <div class="col-12 col-md-8">
              <label class="q-mb-sm block">Motivo de Anulacion:</label>
              <q-input
                v-model="gasto.detalle_estado"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.detalle_estado.$errors.length"
                @blur="v$.detalle_estado.$touch"
                outlined
                autogrow
                dense
              >
                <template v-slot:error>
                  <error-component clave="detalle_estado" :v$="v$" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-separator></q-separator>

        <q-card-actions align="around">
          <q-btn color="negative" @click="anular()">
            <q-icon
              name="bi-file-earmark-excel-fill"
              size="xs"
              class="q-mr-sm"
            ></q-icon>
            Anular
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-page>
  </div>
</template>
<script src="./AnularGastoPage.ts" />
