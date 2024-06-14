<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    ajustarCeldas
    titulo-pagina="Conductores"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información Personal"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!--Nombre chofer -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Chofer</label>
              <q-select
                v-model="conductor.empleado"
                :options="empleados"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarEmpleados"
                @popup-show="ordenarEmpleados"
                @update:model-value="obtenerEmpleado"
                :error="!!v$.empleado.$errors.length"
                error-message="Debes seleccionar un empleado para convertirlo en chofer"
                :option-value="(v) => v.id"
                :option-label="(v) => v.apellidos + ' ' + v.nombres"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label
                        >{{ scope.opt.apellidos }}
                        {{ scope.opt.nombres }}</q-item-label
                      >
                      <q-item-label caption
                        >{{ scope.opt.identificacion }}
                      </q-item-label>
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
                <template v-slot:after>
                  <q-btn color="positive" @click="recargarChoferes">
                    <q-icon
                      size="xs"
                      class="q-mr-sm"
                      name="bi-arrow-clockwise"
                    />
                  </q-btn>
                </template>
              </q-select>
            </div>
            <!-- identificacion-->
            <div class="col-12 col-md-3" v-if="empleado.identificacion">
              <label class="q-mb-sm block">Identificacion</label>
              <q-input
                mask="#############"
                v-model="empleado.identificacion"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- Canton -->
            <div class="col-12 col-md-3" v-if="empleado.canton">
              <label class="q-mb-sm block">Ciudad</label>
              <q-select
                v-model="empleado.canton"
                :options="cantones"
                disable
                dense
                outlined
                :option-value="(v) => v.id"
                :option-label="(v) => v.canton"
                emit-value
                map-options
              />
            </div>
            <!-- direccion -->
            <div class="col-12 col-md-3" v-if="empleado.direccion">
              <label class="q-mb-sm block">Dirección</label>
              <q-input
                v-model="empleado.direccion"
                autogrow
                disable
                outlined
                dense
              />
            </div>
            <!--celular -->
            <div class="col-12 col-md-3" v-if="empleado.celular">
              <label class="q-mb-sm block">Celular</label>
              <q-input v-model="empleado.celular" disable dense outlined />
            </div>

            <!-- correo-->
            <div class="col-12 col-md-3" v-if="empleado.email">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                v-model="empleado.email"
                autogrow
                disable
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
        <informacion-licencia
          :mixin="mixin"
          :conductor="conductor"
          :identificacion="empleado.identificacion"
          :consultarMultas="false"
          @guardado="(data) => guardado(data)"
        ></informacion-licencia>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ConductorPage.ts"></script>
