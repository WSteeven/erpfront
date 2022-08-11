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
          <q-input
            v-model="tarea.codigo_tarea_jp"
            label="Código de tarea JP"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Numero tarea cliente -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.codigo_tarea_cliente"
            label="Código de tarea Cliente"
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
          <q-input
            v-model="tarea.solicitante"
            label="Persona que solicita"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Correo -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.correo_solicitante"
            label="Correo del solicitante"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Fecha agendado -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.fecha_agendado"
            label="Fecha de agendamiento"
            outlined
            dense
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Hora agendado -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.hora_agendado"
            label="Hora de agendamiento"
            outlined
            dense
            readonly
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
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Detalle -->
        <div class="col-12 col-md-9">
          <q-input
            v-model="tarea.detalle"
            label="Detalle"
            outlined
            dense
            autogrow
            type="textarea"
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
      header-class="bg-grey-1"
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Nombre -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.nombre_contacto"
            label="Nombre"
            outlined
            dense
            readonly
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
            readonly
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
            readonly
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
            readonly
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
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

    <q-expansion-item
      class="overflow-hidden"
      style="border-radius: 8px; border: 1px solid #ddd"
      icon="map"
      label="Ubicación del cliente"
      header-class="bg-grey-1"
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Provincia -->
        <div class="col-12 col-md-3">
          <q-select
            v-model="tarea.provincia"
            :options="provincias"
            label="Provincias"
            options-dense
            dense
            outlined
          />
        </div>

        <!-- Ciudad -->
        <div class="col-12 col-md-3">
          <q-select
            outlined
            v-model="tarea.ciudad"
            :options="ciudades"
            label="Ciudades"
            options-dense
            dense
          />
        </div>

        <!-- Parroquia -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.parroquia"
            label="Parroquia/Barrio"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Direccion -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.direccion"
            label="Dirección"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Referencias -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.referencias"
            label="Referencias"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Georeferencia X -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.georeferencia_x"
            label="Georeferencia x"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div>

        <!-- Georeferencia Y -->
        <div class="col-12 col-md-3">
          <q-input
            v-model="tarea.georeferencia_y"
            label="Georeferencia y"
            outlined
            dense
            :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
          ></q-input>
        </div></div
    ></q-expansion-item>
  </q-form>
</template>

<script lang="ts">
import { useAuthenticationStore } from 'src/stores/authentication'
import { provincias, ciudades } from 'src/config/utils'
import { defineComponent, watchEffect } from 'vue'
import { useTareaStore } from 'src/stores/tarea'

export default defineComponent({
  setup() {
    const tareaStore = useTareaStore()
    const tarea = tareaStore.tarea

    const authenticationStore = useAuthenticationStore()

    watchEffect(() => {
      const usuario = authenticationStore.user
      tarea.coordinador = `${usuario.name} ${usuario.apellidos ?? ''} `
    })

    function enviar() {
      //
    }

    return { tarea, provincias, ciudades, enviar }
  },
})
</script>
