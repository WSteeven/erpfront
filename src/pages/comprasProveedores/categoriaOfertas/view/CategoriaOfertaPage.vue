<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Categorias Ofertas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Oferta -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="categoria.tipo_oferta"
              :options="tipos_ofertas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.tipo_oferta.$errors.length"
              error-message="Debes seleccionar un tipo"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_oferta.$errors" :key="error.$uid">
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
          <!-- Nombre -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="categoria.nombre"
              placeholder="Obligatorio"
              :readonly="disabled"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!--Departamentos responsables de calificar-->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block"
              >Departamentos Responsables de Calificar</label
            >
            <q-select
              v-model="categoria.departamentos"
              :options="departamentos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              multiple
              dense
              use-chips
              outlined
              :error="!!v$.departamentos.$errors.length"
              error-message="Debes seleccionar al menos una opcion"
              hint="Dept. Financiero califica a todos los proveedores"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              :option-disable="(v) => v.id === departamentoFinanciero.id"
              emit-value
              map-options
              ><template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.nombre }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.nombre" />
                    <q-item-label caption>{{ opt.responsable }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
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
            </q-select>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-toggle
              :label="categoria.estado ? 'ACTIVO' : 'INACTIVO'"
              v-model="categoria.estado"
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

<script src="./CategoriaOfertaPage.ts" />
