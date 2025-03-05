<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasVisitante"
    paginate
    full
  >
    <template #formulario>
      <div class="row q-col-gutter-sm q-py-md q-mb-md">
        <div class="col-12 col-md-3">
          <voice-input
            v-model="visitante.nombre_completo"
            :v$="v$"
            key-error="nombre_completo"
            label="Nombre completo"
            placeholder="OBLIGATORIO"
          ></voice-input>
        </div>

        <div class="col-12 col-md-3">
          <voice-input
            v-model="visitante.identificacion"
            :v$="v$"
            key-error="identificacion"
            label="Identificación"
            placeholder="OBLIGATORIO"
          ></voice-input>
        </div>

        <div class="col-12 col-md-3">
          <voice-input
            v-model="visitante.celular"
            label="Celular"
            placeholder="OPCIONAL"
          ></voice-input>
        </div>

        <div class="col-12 col-md-3">
          <voice-input
            v-model="visitante.motivo_visita"
            :v$="v$"
            key-error="motivo_visita"
            label="Motivo de visita"
            placeholder="OBLIGATORIO"
          ></voice-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Persona visitada</label>
          <q-input
            v-model="criterioBusqueda"
            placeholder="Escriba y presione enter para buscar"
            hint="Puede buscar por nombre, apellido o identificación"
            :disable="disabled"
            @keydown.enter="listar"
            :error="!!v$.persona_visitada.$errors.length"
            @blur="v$.persona_visitada.$touch"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon
                :name="
                  visitante.persona_visitada
                    ? 'bi-check-circle-fill'
                    : 'bi-check-circle'
                "
                :color="visitante.persona_visitada ? 'positive' : 'grey-6'"
                size="xs"
              ></q-icon>
            </template>

            <template v-slot:error>
              <div
                v-for="error of v$.persona_visitada.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <voice-input
            v-model="visitante.placa_vehiculo"
            :v$="v$"
            key-error="placa_vehiculo"
            label="Placa de vehículo"
            placeholder="OPCIONAL"
          ></voice-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha y hora de ingreso</label>
          <q-input
            v-model="visitante.fecha_hora_ingreso"
            hint="Se recupera de la fecha de registro en la bitácora"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha y hora de salida</label>
          <q-input
            v-model="visitante.fecha_hora_salida"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <div class="col-12 col-md-3">
          <voice-input
            v-model="visitante.observaciones"
            :v$="v$"
            key-error="observaciones"
            label="Observaciones"
            placeholder="OPCIONAL"
          ></voice-input>
        </div>
      </div>
    </template>

    <template #modales>
      <!-- <essential-selectable-table
        ref="refListadoSeleccionable"
        :configuracion-columnas="configuracionColumnasEmpleadosLite"
        :datos="listado"
        @selected="seleccionar"
        tipo-seleccion="single"
      ></essential-selectable-table> -->
    </template>
  </tab-layout>
</template>

<script src="./VisitantePage.ts"></script>
