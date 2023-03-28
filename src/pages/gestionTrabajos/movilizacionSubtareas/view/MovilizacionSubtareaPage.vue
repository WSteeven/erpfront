<template>
  <q-form @submit.prevent class="window-height">
    <q-card class="rounded-card custom-shadow">
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <label class="q-mb-sm block">Me dirijo al siguiente trabajo</label>
            <q-select
              v-model="movilizacion.subtarea"
              :options="subtareas"
              :error="!!v$.subtarea.$errors.length"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="
                (item) => item.codigo_subtarea + ' - ' + item.titulo
              "
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_subtarea
                    }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.subtarea.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
        </div>

        <div class="row">
          <q-btn
            class="col-12"
            color="primary"
            type="submit"
            no-caps
            push
            @click="comenzar()"
          >
            <q-icon name="bi-clock-history" size="xs" class="q-pr-sm"></q-icon>
            <span>Comenzar viaje</span>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script src="./MovilizacionSubtareaPage.ts"></script>
