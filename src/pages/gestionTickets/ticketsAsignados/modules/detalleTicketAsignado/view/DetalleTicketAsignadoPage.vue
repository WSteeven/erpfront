<template>
  <q-card class="rounded-card border-none">
    <q-card-section>
      <detalle-ticket :ticket="ticket"></detalle-ticket>
      <br />
      <archivo-seguimiento
        ref="refArchivoTicket"
        :mixin="mixinArchivoTicket"
        :endpoint="endpoint"
        :disable="true"
        :permitir-eliminar="false"
        :listar-al-guardar="false"
        :permitirSubir="false"
      ></archivo-seguimiento>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
// Dependencias
import { useTicketStore } from 'stores/ticket'
import { endpoints } from 'config/api'

// Componentes
import DetalleTicket from './DetalleTicket.vue'
import ArchivoSeguimiento from 'subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import { ArchivoTicketController } from 'pages/gestionTickets/tickets/infraestructure/ArchivoTicketController '
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { onMounted, ref } from 'vue'

const ticketStore = useTicketStore()
const ticket = ticketStore.filaTicket

const endpoint = endpoints.archivos_tickets

const mixinArchivoTicket = new ContenedorSimpleMixin(
  Archivo,
  new ArchivoTicketController()
)

const refArchivoTicket = ref()

onMounted(() => refArchivoTicket.value.listarArchivos({ ticket_id: ticket.id }))
</script>
