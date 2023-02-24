<template>
  <q-page class="flex flex-center">
    <q-card flat bordered class="my-card bg-grey-1  ">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Generar Reporte Saldo Actual</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Usuarios -->
        <div class="col-12 col-md-3" v-if="is_all_users=='false'">
          <label class="q-mb-sm block">Usuario</label>
          <q-select v-model="reporte_saldo_actual.usuario" :options="usuarios" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.usuario.$errors.length" error-message="Debes seleccionar un usuario" use-input input-debounce="0"
            @filter="filtrarUsuarios" :option-value="(v) => v.id" :option-label="(v) => v.nombres + ' ' + v.apellidos"
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
        <div class="col-12 col-md-3">
          <q-checkbox v-model="is_all_users" color="secondary" label="Todos los usuarios"
            true-value='true' false-value='false' @update:model-value="mostrarUsuarios()"></q-checkbox>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions align="around">
        <q-btn color="positive" @click="generar_reporte(fondo_rotativo_fecha, 'excel')"> <q-icon
            name="bi-file-earmark-excel-fill" size="xs" class="q-mr-sm"></q-icon>Excel</q-btn>
        <q-btn color="negative" @click="generar_reporte(fondo_rotativo_fecha, 'pdf')"> <q-icon
            name="bi-file-earmark-pdf-fill" size="xs" class="q-mr-sm"></q-icon>PDF</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./Reporte_saldo_actualPage.ts"></script>
