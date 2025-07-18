<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" ajustar-celdas>
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- gasto -->
          <div class="col-12 col-md-3" v-if="valija.gasto_id">
            <label class="q-mb-sm block">N° Gasto</label>
            <q-input
              v-model="valija.gasto_id"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            />
          </div>

          <!-- empleado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="valija.empleado"
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
              @popup-show="ordenarLista(empleados, 'nombres')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="empleado" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- descripcion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="valija.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.descripcion.$errors.length"
              @blur="v$.descripcion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="descripcion" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Departamento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Departamento</label>
            <q-select
                v-model="valija.departamento"
                :options="departamentos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.departamento.$errors.length"
                @blur="v$.departamento.$touch"
                use-input
                input-debounce="0"
                @filter="filtrarDepartamentos"
                @popup-show="ordenarLista(departamentos, 'nombre')"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
            >
              <template v-slot:error>
                <error-component clave="departamento" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- destinatario -->
          <div class="col-12 col-md-3" v-if="valija.destinatario">
            <label class="q-mb-sm block">Destinatario</label>
            <q-select
                v-model="valija.destinatario"
                :options="empleados"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.destinatario.$errors.length"
                @blur="v$.destinatario.$touch"
                error-message="Debes seleccionar un empleado"
                use-input
                input-debounce="0"
                @filter="filtrarEmpleados"
                @popup-show="ordenarLista(empleados, 'nombres')"
                :option-value="v => v.id"
                :option-label="v => v.nombres + ' ' + v.apellidos"
                emit-value
                map-options
            >
              <template v-slot:error>
                <error-component clave="destinatario" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>


          <!-- imagen_evidencia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Imagen</label>
            <selector-imagen
                :imagen="valija.imagen_evidencia"
                :disable="disabled"
                file_extensiones=".jpg, image/*"
                @update:modelValue="data => (valija.imagen_evidencia = data)"
                :error="!!v$.imagen_evidencia.$errors.length"
            ></selector-imagen>
          </div>

        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./ValijaPage.ts" />
