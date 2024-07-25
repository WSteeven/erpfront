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
                  v-model="newEvent.title"
                  label="Título del Evento"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-input
                  v-model="newEvent.with"
                  label="Anfitrión"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-input
                  v-model="newEvent.time.start"
                  label="Fecha de Inicio"
                  type="datetime-local"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-input
                  v-model="newEvent.time.end"
                  label="Fecha de Fin"
                  type="datetime-local"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-select
                  v-model="newEvent.colorScheme"
                  :options="['Capacitaciones', 'Reunión', 'General']"
                  label="Tipo de Evento"
                  outlined
                  required
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-checkbox
                  v-model="newEvent.isEditable"
                  label="Es editable"
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-checkbox
                  v-model="newEvent.isCustom"
                  label="Es personalizado"
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-input
                  v-model="newEvent.description"
                  label="Descripción"
                  type="textarea"
                  outlined
                  dense
                  class="q-mb-xs q-pa-xs"
                />
                <q-btn
                  type="submit"
                  label="Agregar Evento"
                  color="primary"
                  dense
                  class="q-mt-md q-pa-xs"
                />
              </q-card-section>
            </q-card>
          </q-form>
        </q-card-section>
      </q-card>
      <q-card class="calendar-container">
        <q-card-section>
          <Qalendar
            :selected-date="new Date()"
            :events="events"
            :config="config"
            @event-was-clicked="console.log('Evento clicado');"
            @event-was-dragged="console.log('Evento arrastrado:');"
            @event-was-resized="console.log('Evento redimensionado:');"
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
