<template>
  <div class="row q-col-gutter-sm q-mb-lg">
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Código del ticket</label>
      <b>{{ ticket.codigo }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Asunto</label>
      <b>{{ ticket.asunto }}</b>
    </div>

    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Descripción</label>
      <b>{{ ticket.descripcion }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Prioridad</label>
      <b>{{ ticket.prioridad }}</b>
    </div>

    <div v-if="ticket.fecha_hora_limite" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora límite</label>
      <b>{{ ticket.fecha_hora_limite }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Estado</label>
      <b>{{ ticket.estado }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Tipo de ticket</label>
      <b>{{ ticket.tipo_ticket }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Actual departamento responsable</label>
      <b>{{ ticket.departamento_responsable }}</b>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Actual empleado responsable</label>
      <b>{{ ticket.responsable }}</b>
    </div>
  </div>

  <q-separator class="q-mt-xl q-mb-md"></q-separator>
  <div class="text-center text-grey-8 q-mb-xl">
    <q-icon name="bi-arrow-left-right" size="xs" class="q-pr-sm"></q-icon
    >Cambiar responsable
  </div>

  <div class="row q-col-gutter-xs">
    <!-- Departamento -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Nuevo departamento responsable</label>
      <q-select
        v-model="reagendar.departamento_responsable"
        :options="departamentos"
        @filter="filtrarDepartamentos"
        transition-show="scale"
        transition-hide="scale"
        hint="Obligatorio"
        options-dense
        dense
        outlined
        :option-label="(item) => item.nombre"
        :option-value="(item) => item.id"
        use-input
        input-debounce="0"
        emit-value
        map-options
        @update:model-value="
          () => {
            reagendar.responsable = null
            obtenerResponsables(reagendar.departamento_responsable)
          }
        "
        :error="!!v$.departamento_responsable.$errors.length"
        @blur="v$.departamento_responsable.$touch"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <div
            v-for="error of v$.departamento_responsable.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-select>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Nuevo empleado responsable</label>
      <q-select
        v-model="reagendar.responsable"
        :options="empleados"
        @filter="filtrarEmpleados"
        transition-show="scale"
        transition-hide="scale"
        hint="Obligatorio"
        options-dense
        dense
        outlined
        :option-label="(item) => `${item.nombres} ${item.apellidos}`"
        :option-value="(item) => item.id"
        use-input
        input-debounce="0"
        emit-value
        map-options
        :error="!!v$.responsable.$errors.length"
        @blur="v$.responsable.$touch"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Primero seleccione un departamento
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <div v-for="error of v$.responsable.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-select>
    </div>
  </div>

  <div class="row q-gutter-sm justify-end">
    <!-- Boton guardar -->
    <q-btn color="primary" no-caps push @click="cambiar()">
      <q-icon name="bi-arrow-left-right" size="xs" class="q-pr-sm"></q-icon>
      <span>Cambiar responsable</span>
    </q-btn>

    <q-btn color="negative" no-caps push @click="cancelar()">
      <q-icon name="bi-x" size="xs" class="q-pr-sm"></q-icon>
      <span>Cancelar</span>
    </q-btn>
  </div>
</template>

<script src="./ReagendarTicketPage.ts"></script>
