<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Solicitudes de fondos para viáticos"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :permitir-editar="esContabilidad"
    :filtrar="filtrarSolicitudes"
    :accion1="editarGasto"
    ajustarCeldas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Lugar -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lugar</label>
            <q-select
              v-model="gasto.lugar"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.lugar.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filtrarCantones"
              @blur="v$.lugar.$touch"
              :option-value="v => v.id"
              :option-label="v => v.canton"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="lugar" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>

          <!-- Monto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Monto</label>
            <q-input
              v-model="gasto.monto"
              placeholder="Obligatorio"
              type="number"
              autogrow
              :disable="disabled"
              :error="!!v$.monto.$errors.length"
              @blur="v$.monto.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="monto" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- Grupos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="gasto.grupo"
              :options="grupos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.grupo.$errors.length"
              error-message="Debes seleccionar un grupo"
              use-input
              input-debounce="0"
              @filter="filtrarGrupos"
              @blur="v$.grupo.$touch"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="grupo" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Motivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Motivo</label>
            <q-select
              v-model="gasto.motivo"
              :options="motivos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              multiple
              dense
              use-chips
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarMotivos"
              @blur="v$.motivo.$touch"
              :error="!!v$.motivo.$errors.length"
              error-message="Debes seleccionar uno o varios sub_detalle"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.nombre }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.nombre" />
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <error-component clave="motivo" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
<!--          Revisado -->
          <div class="col-12 col-md-3 " v-if="[acciones.consultar, acciones.editar].includes(accion)">
            <label class="q-mb-sm block">¿Solicitud revisada?</label>
            <q-toggle
              :label="gasto.revisado ? 'SI' : 'NO'"
              v-model="gasto.revisado"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- Select estado -->
          <div
            v-if="[acciones.consultar, acciones.editar].includes(accion)"
            class="col-12 col-md-3 q-mb-md"
          >
            <label
              color="light-green-2"
              class="text-positive text-bold q-mb-sm inline-block bg-light-green-2 rounded q-px-md"
            >Estado
            </label>
            <q-select
              v-model="gasto.estado"
              :options="estados"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              disable
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- Observacion -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Descripcion</label>
            <q-input
              v-model="gasto.observacion"
              placeholder="Obligatorio"
              autogrow
              :disable="disabled"
              :error="!!v$.observacion.$errors.length"
              hint="Escriba su requerimiento al que desea pedir el gasto"
              @blur="v$.observacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="observacion" :v$="v$" />
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./GastoCoordinadorPage.ts"></script>
