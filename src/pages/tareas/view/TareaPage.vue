<template>
  <q-page padding>
    <div class="text-h6 q-my-md q-ml-md">Gestión de tareas</div>
    {{ authentication.user }}
    <!-- {{ datos }} -->
    <q-card class="custom-shadow">
      <q-card-section>
        <q-form @submit.prevent="enviar()">
          <q-expansion-item
            class="overflow-hidden q-mb-md"
            style="border-radius: 8px; border: 1px solid #ddd"
            icon="explore"
            label="Información de la tarea"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <!-- Numero cliente JP -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.numero_jp"
                  label="Número de tarea JP"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Numero tarea cliente -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.numero_cliente"
                  label="Número de tarea Cliente"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Cliente -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.cliente"
                  label="Cliente"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Solicitante -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.solicitante"
                  label="Persona que solicita"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Fecha de vencimiento -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.fecha_vencimiento"
                  label="Fecha de vencimiento"
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
                        <q-date v-model="tarea.fecha_vencimiento">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <!-- Fecha agendado -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.fecha_agendado"
                  label="Fecha agendado"
                  outlined
                  dense
                  readonly=""
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Hora agendado -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.hora_agendado"
                  label="Hora agendado"
                  outlined
                  dense
                  readonly=""
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Coordinador -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.coordinador"
                  label="Coordinador"
                  outlined
                  dense
                  readonly=""
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>
            </div>
          </q-expansion-item>

          <q-expansion-item
            class="overflow-hidden q-mb-md"
            style="border-radius: 8px; border: 1px solid #ddd"
            icon="phone"
            label="Información de contacto"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <!-- Nombre -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.nombre_contacto"
                  label="Nombre"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Apellidos -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.apellidos_contacto"
                  label="Apellidos"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Teléfono -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.telefono_contacto"
                  label="Teléfono"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Celular -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.celular_contacto"
                  label="Celular"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>
              <div class="col-12">
                <div class="row justify-end">
                  <q-btn
                    label="Seleccionar contacto"
                    color="positive"
                    no-caps
                    rounded
                    type="button"
                  ></q-btn>
                  <q-btn
                    label="Registrar nuevo contacto"
                    color="positive"
                    no-caps
                    rounded
                    type="button"
                  ></q-btn>
                </div>
              </div></div
          ></q-expansion-item>

          <q-expansion-item
            class="overflow-hidden"
            style="border-radius: 8px; border: 1px solid #ddd"
            icon="map"
            label="Ubicación del cliente"
          >
            <div class="row q-col-gutter-sm q-pa-md">
              <!-- Nombre -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.nombre_contacto"
                  label="Nombre"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Apellidos -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.apellidos_contacto"
                  label="Apellidos"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Teléfono -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.telefono_contacto"
                  label="Teléfono"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>

              <!-- Celular -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model="tarea.celular_contacto"
                  label="Celular"
                  outlined
                  dense
                  :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
                ></q-input>
              </div>
              <div class="col-12">
                <div class="row justify-end">
                  <q-btn
                    label="Seleccionar contacto"
                    color="positive"
                    no-caps
                    rounded
                    type="button"
                  ></q-btn>
                  <q-btn
                    label="Registrar nuevo contacto"
                    color="positive"
                    no-caps
                    rounded
                    type="button"
                  ></q-btn>
                </div>
              </div></div
          ></q-expansion-item>
          <div class="col-12">
            <q-toggle v-model="toggle" label="Toggle"></q-toggle>
          </div>

          <div class="col-12">
            <essential-table
              :configuracionColumnas="configuracionColumnas"
              :datos="datos"
            ></essential-table>
          </div>

          <div class="col-12">
            <q-btn label="Enviar" color="primary" type="submit"></q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script src="./TareaPage.ts"></script>
