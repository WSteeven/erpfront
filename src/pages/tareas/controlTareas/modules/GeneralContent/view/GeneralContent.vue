<template>
  <q-form @submit.prevent="enviar()">
    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      icon="explore"
      label="Información de la tarea"
      header-class="bg-grey-1"
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Numero cliente JP -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de tarea JP</label>
          <q-input
            v-model="tarea.codigo_tarea_jp"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Numero tarea cliente -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de tarea Cliente</label>
          <q-input
            v-model="tarea.codigo_tarea_cliente"
            placeholder="Opcional"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Cliente -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Cliente</label>
          <q-input
            v-model="tarea.cliente"
            placeholder="Obligatorio"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Fecha de inicio -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de inicio</label>
          <q-input
            v-model="tarea.fecha_inicio"
            placeholder="Opcional"
            outlined
            dense
            mask="date"
            :rules="['date']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="tarea.fecha_inicio">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <!-- Fecha de vencimiento -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de finalización</label>
          <q-input
            v-model="tarea.fecha_finalizacion"
            placeholder="Opcional"
            outlined
            dense
            mask="date"
            :rules="['date']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="tarea.fecha_finalizacion">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <!-- Solicitante -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Persona solicitante</label>
          <q-input
            v-model="tarea.solicitante"
            placeholder="Opcional"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Correo -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Correo del solicitante</label>
          <q-input
            v-model="tarea.correo_solicitante"
            placeholder="Opcional"
            type="email"
            outlined
            dense
          ></q-input>
        </div>

        <!-- Fecha agendado -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de agendamiento</label>
          <q-input
            v-model="tarea.fecha_agendado"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Hora agendado -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora de agendamiento</label>
          <q-input
            v-model="tarea.hora_agendado"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Coordinador -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordinador</label>
          <q-input
            v-model="tarea.coordinador"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Detalle -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Detalle / Proyecto / Ruta</label>
          <q-input
            v-model="tarea.detalle"
            placeholder="Obligatorio"
            outlined
            dense
            autogrow
            type="textarea"
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Es proyecto -->
        <div class="col-12 col-md-3">
          <q-checkbox
            v-model="tarea.es_proyecto"
            label="Es proyecto"
            outlined
            dense
          ></q-checkbox>
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      class="overflow-hidden q-mb-md"
      style="border-radius: 8px; border: 1px solid #ddd"
      icon="phone"
      label="Información de contacto"
      header-class="bg-grey-1"
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Nombre -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Nombres</label>
          <q-input
            v-model="tarea.nombre_contacto"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Apellidos -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Apellidos</label>
          <q-input
            v-model="tarea.apellidos_contacto"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Teléfono -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Teléfono</label>
          <q-input
            v-model="tarea.telefono_contacto"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <!-- Celular -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Celular</label>
          <q-input
            v-model="tarea.celular_contacto"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
          ></q-input>
        </div>

        <div class="col-12">
          <div class="row justify-end q-gutter-sm">
            <q-btn color="positive" no-caps rounded push>
              <q-icon name="bi-collection" size="xs" class="q-pr-sm"></q-icon>
              <div>Seleccionar contacto</div>
            </q-btn>
            <q-btn color="positive" no-caps rounded push>
              <q-icon name="bi-plus" class="q-pr-sm"></q-icon>
              <div>Registrar nuevo contacto</div>
            </q-btn>
          </div>
        </div>
      </div></q-expansion-item
    >
  </q-form>
</template>

<script src="./GeneralContent.ts"></script>
