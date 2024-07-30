<template>
  <q-page>
    <div class="container">
      <q-card class="form-container">
        <q-card-section>
          <q-form @submit.prevent="addEvent">
            <q-card class="scrollable-card">
              <q-card-section>
                <div class="text-h6">REGISTRAR EVENTO</div>
              </q-card-section>
              <q-card-section>
                <q-input
                  v-model="evento.titulo"
                  label="Título del Evento"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-input
                  v-model="evento.anfitrion"
                  label="Anfitrión"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-input
                  v-model="evento.fecha_hora_inicio"
                  label="Fecha de Inicio"
                  type="datetime-local"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-input
                  v-model="evento.fecha_hora_fin"
                  label="Fecha de Fin"
                  type="datetime-local"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-select
                  v-model="evento.colorScheme"
                  :options="['Capacitaciones', 'Reunión', 'General']"
                  label="Tipo de Evento"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-checkbox
                  v-model="evento.es_editable"
                  label="Es editable"
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-checkbox
                  v-model="evento.es_personalizado"
                  label="Es personalizado"
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-input
                  v-model="evento.descripcion"
                  label="Descripción"
                  type="textarea"
                  outlined
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <div :class="{ 'q-pa-md': $q.screen.xs }">
                  <div class="row justify-evenly q-col-gutter-x-xs">
                    <button-submits
                      :accion="accion"
                      :permitirGuardar="true"
                      :disabled="storeCargando.cargando"
                      labelGuardar="Guardar"
                      @cancelar="reestablecer"
                      @editar="editar(evento, true)"
                      @eliminar="eliminar(evento)"
                      @guardar="guardar(evento)"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </q-card-section>
      </q-card>
      <q-card class="calendar-container">
        <q-card-section>
          <essential-calendar
            :eventos="listado"
            @clicked-event="console.log('Evento clicado')"
            @dragged-event="console.log('Evento arrastrado:')"
            @resized-event="console.log('Evento redimensionado:')"
            @edit-event="console.log('Editar Evento')"
            @delete-event="console.log('Eliminar evento')"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" src="./EventoPage.ts"></script>

<style scoped>
@import 'qalendar/dist/style.css';

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  height: 100vh;
}

.form-container {
  width: 35%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
}

.calendar-container {
  width: 62%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
}

.scrollable-card {
  height: 100%;
  overflow-y: auto;
}
</style>
