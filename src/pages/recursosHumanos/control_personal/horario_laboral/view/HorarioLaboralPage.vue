<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Horario Laboral"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tipo de Horario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de Horario</label>
            <q-select
              v-model="horarioLaboral.tipo"
              :options="tiposHorariosOptions"
              placeholder="Seleccionar"
              :disable="disabled"
              outlined
              dense
              options-dense
              @update:model-value="tipoHorarioSeleccionado"
              :error="!!v$.tipo.$errors.length"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tipo" :v$="v$" />
              </template>
            </q-select>
          </div>

          <!-- Dia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Día</label>
            <q-select
                v-model="horarioLaboral.dia"
                :options="optionsDias"
                placeholder="Seleccionar"
                :disable="disabled"
                outlined
                dense
                options-dense
                @update:model-value="tipoHorarioSeleccionado"
                :error="!!v$.tipo.$errors.length"
                emit-value
                map-options
            >
              <template v-slot:error>
                <error-component clave="tipo" :v$="v$" />
              </template>
            </q-select>
          </div>
          
          <!-- Nombre -->
          <div
            class="col-12 col-md-3"
            v-if="horarioLaboral.tipo == 'Personalizado'"
          >
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="horarioLaboral.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>



          <!-- Hora de Entrada -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora de Entrada</label>
            <q-input
              v-model="horarioLaboral.hora_entrada"
              placeholder="Obligatorio"
              :disable="disabled"
              type="time"
              :error="!!v$.hora_entrada.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="hora_entrada" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Hora de Salida -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora de Salida</label>
            <q-input
              v-model="horarioLaboral.hora_salida"
              placeholder="Obligatorio"
              :disable="disabled"
              type="time"
              :error="!!v$.hora_salida.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="hora_salida" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!--          Tiene pausas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">¿Tiene Pausas?</label>
            <option-group-component
              v-model="horarioLaboral.tiene_pausa"
              :disable="disabled"
            />
          </div>

          <!--Inicio de Pausa-->
          <div class="col-12 col-md-3" v-if="horarioLaboral.tiene_pausa">
            <label class="q-mb-sm block">Inicio de Pausa</label>
            <q-input
              v-model="horarioLaboral.inicio_pausa"
              placeholder="Obligatorio"
              :disable="disabled"
              type="time"
              :error="!!v$.inicio_pausa.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="inicio_pausa" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!--Fin de Pausa-->
          <div class="col-12 col-md-3" v-if="horarioLaboral.tiene_pausa">
            <label class="q-mb-sm block">Fin de Pausa</label>
            <q-input
              v-model="horarioLaboral.fin_pausa"
              placeholder="Obligatorio"
              :disable="disabled"
              type="time"
              :error="!!v$.fin_pausa.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="fin_pausa" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- Activo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-toggle
              :label="horarioLaboral.activo ? 'ACTIVO' : 'INACTIVO'"
              v-model="horarioLaboral.activo"
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

<script src="./HorarioLaboralPage.ts"></script>
