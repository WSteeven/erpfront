<template>
  <div class="row q-col-gutter-sm q-pa-md">
    <!-- Estado -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Estado del trabajo</label>
      <estados-subtareas
        :propsTable="{ value: subtarea.estado }"
      ></estados-subtareas>
    </div>

    <!-- Fecha de creacion -->
    <div v-if="subtarea.fecha_hora_creacion" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de creación</label>
      <q-input v-model="subtarea.fecha_hora_creacion" outlined dense disable>
      </q-input>
    </div>

    <div v-if="subtarea.fecha_hora_asignacion" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de asignación</label>
      <q-input v-model="subtarea.fecha_hora_asignacion" outlined dense disable>
      </q-input>
    </div>

    <div v-if="subtarea.fecha_hora_agendado" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de agendamiento</label>
      <q-input v-model="subtarea.fecha_hora_agendado" outlined dense disable>
      </q-input>
    </div>

    <!-- Fecha de inicio -->
    <div v-if="subtarea.fecha_hora_ejecucion" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de ejecución del trabajo</label>
      <q-input v-model="subtarea.fecha_hora_ejecucion" outlined dense disable>
      </q-input>
    </div>

    <!-- Fecha y hora de estado realizado -->
    <div v-if="subtarea.fecha_hora_realizado" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora realizado</label>
      <q-input v-model="subtarea.fecha_hora_realizado" outlined dense disable>
      </q-input>
    </div>

    <!-- Fecha de finalizacion -->
    <div v-if="subtarea.fecha_hora_finalizacion" class="col-12 col-md-3">
      <label class="q-mb-sm block"
        >Fecha y hora de finalización de trabajo</label
      >
      <q-input
        v-model="subtarea.fecha_hora_finalizacion"
        outlined
        dense
        disable
      >
      </q-input>
    </div>

    <!-- Técnico responsable -->
    <div v-if="subtarea.cantidad_dias" class="col-12 col-md-3">
      <label class="q-mb-sm block">Cantidad de días</label>
      <q-input
        v-model="subtarea.cantidad_dias"
        outlined
        disable
        dense
      ></q-input>
    </div>

    <!-- Fecha y hora de estado suspendido -->
    <div v-if="subtarea.fecha_hora_pendiente" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de estado pendiente</label>
      <q-input v-model="subtarea.fecha_hora_pendiente" outlined dense disable>
      </q-input>
    </div>

    <!-- Causa de pendiente -->
    <div v-if="subtarea.motivo_pendiente" class="col-12 col-md-3">
      <label class="q-mb-sm block">Motivo de pendiente</label>
      <q-input
        v-model="subtarea.motivo_pendiente"
        disable
        outlined
        type="textarea"
        autogrow
        dense
      ></q-input>
    </div>

    <!-- Fecha y hora de estado suspendido -->
    <div v-if="subtarea.fecha_hora_suspendido" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de estado suspendido</label>
      <q-input v-model="subtarea.fecha_hora_suspendido" outlined dense disable>
      </q-input>
    </div>

    <!-- Causa de la suspencion -->
    <div v-if="subtarea.motivo_suspendido" class="col-12 col-md-3">
      <label class="q-mb-sm block">Motivo de la suspención</label>
      <q-input
        v-model="subtarea.motivo_suspendido"
        disable
        outlined
        type="textarea"
        autogrow
        dense
      ></q-input>
    </div>

    <!-- Fecha y hora de estado cancelacion -->
    <div v-if="subtarea.fecha_hora_cancelado" class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de cancelación</label>
      <q-input v-model="subtarea.fecha_hora_cancelado" outlined dense disable>
      </q-input>
    </div>

    <!-- Causa de la suspencion -->
    <div v-if="subtarea.motivo_cancelado" class="col-12 col-md-3">
      <label class="q-mb-sm block">Motivo de la cancelación</label>
      <q-input
        v-model="subtarea.motivo_cancelado"
        placeholder="Opcional"
        type="textarea"
        autogrow
        outlined
        dense
        disable
      ></q-input>
    </div>
  </div>
</template>

<script src="./TiempoSubtarea.ts"></script>
