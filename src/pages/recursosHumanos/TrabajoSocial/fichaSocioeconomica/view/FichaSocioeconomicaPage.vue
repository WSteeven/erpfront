<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnas"
    titulo-pagina="Ficha Socioeconomica"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarListadoFichas"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="1. Datos Personales"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Colaborador -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Colaborador</label>
              <q-select
                v-model="ficha.empleado"
                :options="empleados"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.empleado.$errors.length"
                @blur="v$.empleado.$touch"
                error-message="Debes seleccionar un empleado"
                use-input
                input-debounce="0"
                @filter="filtrarEmpleados"
                @update:model-value="empleadoSeleccionado"
                @popup-show="ordenarLista(empleados, 'nombres')"
                :option-value="v => v.id"
                :option-label="v => v.nombres + ' ' + v.apellidos"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.empleado.$errors" :key="error.$uid">
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
            <!-- Identificación -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Identificación</label>
              <q-input
                v-model="empleado.identificacion"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              ></q-input>
            </div>
            <!-- Nombres -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Nombres</label>
              <q-input
                v-model="empleado.nombres"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              />
            </div>
            <!-- Apellidos -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Apellidos</label>
              <q-input
                v-model="empleado.apellidos"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              />
            </div>
            <!-- Telefono -->
            <div class="col-12 col-md-4">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                type="tel"
                v-model="empleado.telefono"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.telefono.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Canton -->
            <div class="col-12 col-md-4 q-mb-md">
              <label class="q-mb-sm block">Canton</label>
              <q-input v-model="empleado.canton" disable dense outlined />
            </div>
            <!-- Estado -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Estado</label>
              <q-toggle
                :label="empleado.estado ? 'ACTIVO' : 'INACTIVO'"
                v-model="empleado.estado"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>


          </div>
        </q-expansion-item>

      </q-form>
    </template>
    <p>Aqui va la ficha socieconomica de un empleado</p>
  </tab-layout-filter-tabs2>
</template>
<script src="./FichaSocioeconomicaPage.ts" />
