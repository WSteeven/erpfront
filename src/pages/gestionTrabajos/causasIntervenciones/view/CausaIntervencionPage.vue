<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasCausaIntervencion"
    :permitir-eliminar="false"
    :permitir-editar="esAdministrador"
    :permitir-consultar="esAdministrador"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="causaIntervencion.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              :disable="disabled"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.cliente.$errors.length"
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

          <!-- Categoria -->
          <div v-if="causaIntervencion.cliente" class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione un tipo de trabajo</label>
            <q-select
              v-model="causaIntervencion.tipo_trabajo"
              :options="tiposTrabajos"
              @filter="filtrarTiposTrabajos"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :disable="disabled"
              :option-label="(item) => item.descripcion"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.tipo_trabajo.$errors.length"
              @blur="v$.tipo_trabajo.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.tipo_trabajo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Nombre -->
          <div v-if="causaIntervencion.tipo_trabajo" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Nombre de la causa de intervención</label
            >
            <q-input
              v-model="causaIntervencion.nombre"
              placeholder="Obligatorio"
              @update:model-value="
                (v) => (causaIntervencion.nombre = v.toUpperCase())
              "
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div v-if="causaIntervencion.nombre" class="col-12 col-md-3">
            <br />
            <q-toggle
              v-model="causaIntervencion.activo"
              checked-icon="check"
              :disable="disabled"
              label="Activo"
              color="positive"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./CausaIntervencionPage.ts"></script>
