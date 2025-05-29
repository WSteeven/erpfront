<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Base comisional"
    :ajustarCeldas="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">

          <!-- Modalidades -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Modalidad</label>
            <q-select
                v-model="base.modalidad"
                :options="modalidades"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                outlined
                :disable="disabled"
                :error="!!v$.modalidad.$errors.length"
                @blur="v$.modalidad.$touch"
                error-message="Debes seleccionar un modalidad"
                use-input
                input-debounce="0"
                @filter="filtrarModalidades"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
            >
              <template v-slot:error>
                <error-component clave="modalidad" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>

          <!-- Presupuesto de ventas  -->
          <div class="col-12 col-md-3" >
            <label class="q-mb-sm block">Presupuesto Ventas</label>
            <q-input
                v-model="base.presupuesto_ventas"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.presupuesto_ventas.$errors.length"
                @blur="v$.presupuesto_ventas.$touch"
                outlined
                dense
            >
              <template v-slot:error>
                <error-component :v$="v$" clave="presupuesto_ventas" />
              </template>
            </q-input>
          </div>

          <!--bono_comision_semanal-->
          <div class="col-12 col-md-3" >
            <label class="q-mb-sm block">Bono Comisión Semanal</label>
            <q-input
                v-model="base.bono_comision_semanal"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.bono_comision_semanal.$errors.length"
                @blur="v$.bono_comision_semanal.$touch"
                outlined
                dense
            >
              <template v-slot:error>
                <error-component :v$="v$" clave="bono_comision_semanal" />
              </template>
            </q-input>
          </div>

          <!-- Tabla -->
          <div class="col-12">
            <essential-table
                titulo="Comisiones"
                :configuracionColumnas="configuracionColumnasComisiones"
                :datos="base.comisiones"
                :v$="v$"
                key-error="comisiones"
                :permitirConsultar="false"
                :permitirEditarCeldas="true"
                :permitirEditar="false"
                :permitirEliminar="false"
                :mostrarBotones="false"
                :accion1-header="btnAgregarFila"
                :ajustarCeldas="true"
                :altoFijo="false"
            />
          </div>

        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./BaseComisionPage.ts" />
