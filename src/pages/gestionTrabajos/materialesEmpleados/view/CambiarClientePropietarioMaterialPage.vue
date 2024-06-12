<template>
  <q-card class="q-mb-md rounded no-border custom-shadow"
    ><q-card-section>
      <div class="border-1 text-primary text-bold q-mb-lg">
        <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
        Modificar el registro
      </div>
      <q-expansion-item
        class="overflow-hidden q-mb-md expansion"
        label="Información del Registro"
        header-class="text-bold bg-header-collapse"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          <div
            class="col-12 col-sm-3"
            v-for="(value, key) in registro"
            :key="key"
          >
            <label class="q-mb-sm block">{{ key.toUpperCase() }}</label>
            <q-input
              v-model="valor"
              :placeholder="value"
              dense
              disable
              outlined
            />
          </div>
        </div>
      </q-expansion-item>
      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Modifique la cantidad</label>
          <q-input
            type="number"
            v-model="registro.stock_actual"
            placeholder="OBLIGATORIO"
            :error="!!v$.stock_actual.$errors.length"
            outlined
            dense
            ><template v-slot:error>
              <div v-for="error of v$.stock_actual.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template></q-input
          >
        </div>
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Modifica el cliente</label>
          <q-select
            v-model="registro.cliente"
            :options="clientes"
            options-dense
            clearable
            dense
            outlined
            use-input
            use-chips
            :error="!!v$.cliente.$errors.length"
            input-debounce="0"
            :option-label="(item) => item.razon_social"
            :option-value="(item) => item.id"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:error>
              <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>
        {{ registro }}
        <div class="row justify-end q-col-gutter-x-xs">
          <ButtonSubmits
            permitirGuardar
            :accion="acciones.editar"
            :disabled="cargando.cargando"
            @cancelar="reestablecer()"
            @editar="guardar()"
          >
          </ButtonSubmits>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script src="./CambiarClientePropietarioMaterialPage.ts" />
