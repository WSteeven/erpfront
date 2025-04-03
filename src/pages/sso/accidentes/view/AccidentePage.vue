<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasAccidente"
    :tabOptions="tabOptionsEstadosAccidentes"
    :filtrar="filtrarAccidentes"
    :tabDefecto="tabActual"
    ajustar-celdas
    forzar-listar
    label-guardar="Guardar accidente"
    label-editar="Actualizar accidente"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Titulo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Título</label>
            <q-input
              v-model="accidente.titulo"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.titulo?.$errors?.length"
              @blur="v$.titulo?.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.titulo?.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Descripcion -->
          <div class="col-12 col-md-9">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="accidente.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.descripcion?.$errors.length"
              @blur="v$.descripcion?.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion?.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <fecha-hora
              v-model="accidente.fecha_hora_ocurrencia"
              label="Fecha y hora de ocurrencia"
              :disable="disabled"
            />
          </div>

          <!-- Empleado reporta -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Empleado que reporta el accidente</label
            >
            <q-input
              v-model="accidente.empleado_reporta"
              disable
              outlined
              dense
            />
          </div>

          <div class="col-12 col-md-3">
            <coordenadas-input
              v-model="accidente.coordenadas"
              :disable="disabled"
              :validador="v$"
            />
          </div>

          <!-- Lugar del accidente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lugar del accidente</label>
            <q-input
              v-model="accidente.lugar_accidente"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.lugar_accidente?.$errors?.length"
              @blur="v$.lugar_accidente?.$touch"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.lugar_accidente?.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Consecuencias del accidente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Consecuencias del accidente</label>
            <q-input
              v-model="accidente.consecuencias"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.consecuencias?.$errors?.length"
              @blur="v$.consecuencias?.$touch"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.consecuencias?.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Empleados involucrados</label>
            <q-select
              v-model="accidente.empleados_involucrados"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              multiple
              use-input
              use-chips
              input-debounce="0"
              :disable="disabled"
              :error="!!v$.empleados_involucrados?.$errors.length"
              @blur="v$.empleados_involucrados?.$touch"
              @filter="filtrarEmpleados"
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ `${opt.apellidos} ${opt.nombres}` }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.label" />
                  </q-item-section>
                  <q-item-section side>
                    <q-checkbox
                      :model-value="selected"
                      dense
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.empleados_involucrados?.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Manejo de archivos -->
          <div class="col-12">
            <gestor-archivos
              ref="refArchivo"
              label="Adjuntar archivos"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idEntidad"
            />
          </div>
        </div>
      </q-form>
    </template>

    <template #formulario-2>
      <div v-show="accidente.id" class="row bg-desenfoque rounded q-py-md">
        <div class="col-12">
          <span
            class="q-ml-md q-px-md q-py-xs rounded text-bold bg-grey-4 inline-block"
          >
            <q-icon name="bi-clock-history" class="q-mr-sm"></q-icon>
            Seguimiento del accidente
          </span>
        </div>

        <div class="col-12">
          <seguimiento-accidente-page ref="refSeguimiento"></seguimiento-accidente-page>
        </div>
      </div>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./AccidentePage.ts"></script>
