<template>
  <q-chip
  >
    <q-icon name="bi-circle-fill" class="q-mr-xs"></q-icon
    >{{ propsTable.value }}
  </q-chip>

</template>

<script setup>
import { estadosTickets } from 'config/tickets.utils'
import { estadosTrabajos } from 'config/utils'
import { estadosCitaMedica } from 'config/utils/medico'

const props = defineProps({
  propsTable: {
    type: Object,
    required: true,
  },
})
</script>
