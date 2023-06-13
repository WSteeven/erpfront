import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { Ticket } from 'pages/gestionTickets/tickets/domain/Ticket'

export const useTicketStore = defineStore('ticket', () => {
  const filaTicket = reactive(new Ticket())
  const posicionFilaTicket = ref()

  return {
    filaTicket,
    posicionFilaTicket,
  }
})
