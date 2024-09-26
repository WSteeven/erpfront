<template>
  <div>
    <Qalendar
      :events="eventos"
      :selected-date="selectedDate"
      @date-was-clicked="onDateClick"
      :config="config"
    />
    <q-dialog v-model="modalOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Registrar Evento</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="agregarEvento">
            <q-input v-model="evento.titulo" label="Título" dense outlined required />
            <q-select v-model="evento.tipo_evento" label="Tipo de Evento" :options="tiposEvento" dense outlined required />
            <q-input v-model="evento.fecha_hora_inicio" label="Fecha de Inicio" type="date" dense outlined required />
            <q-input v-model="evento.fecha_hora_fin" label="Fecha de Fin" type="date" dense outlined required />
            <q-input v-model="evento.descripcion" label="Descripción" dense outlined textarea />
            <q-btn type="submit" color="primary" label="Agregar Evento" />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { Qalendar } from 'qalendar'

export default {
  components: {
    Qalendar
  },
  props: {
    eventos: Array
  },
  data() {
    return {
      modalOpen: false,
      selectedDate: '',
      evento: {
        titulo: '',
        tipo_evento: '',
        fecha_hora_inicio: '',
        fecha_hora_fin: '',
        descripcion: ''
      },
      tiposEvento: ['Cumpleaños', 'Capacitaciones'],
      config: {
        locale: 'es',
        defaultMode: 'month'
      }
    }
  },
  methods: {
    onDateClick(date) {
      this.selectedDate = date
      this.evento.fecha_hora_inicio = this.selectedDate
      this.evento.fecha_hora_fin = this.selectedDate
      this.modalOpen = true
    },
    agregarEvento() {
      this.$emit('agregar-evento', { ...this.evento })
      this.modalOpen = false
      this.resetForm()
    },
    resetForm() {
      this.evento = {
        titulo: '',
        tipo_evento: '',
        fecha_hora_inicio: '',
        fecha_hora_fin: '',
        descripcion: ''
      }
    }
  }
}
</script>
