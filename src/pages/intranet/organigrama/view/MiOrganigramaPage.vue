<template>
  <div class="col-12" id="tree"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import OrgChart from '@balkangraph/orgchart.js'

const chart = ref({})

onMounted(() => {
  chart.value = new OrgChart(document.getElementById('tree'), {
    nodeBinding: {
      field_0: 'name'
    },
    nodes: [
      { id: 1, name: 'Wellington Barros' },
      { id: 2, pid: 1, name: 'Jairo Quiñonez' },
      { id: 3, pid: 1, name: 'Jonathan Veintimilla' },
      { id: 4, pid: 3, name: 'Dario Loja' },
      { id: 5, pid: 4, name: 'Milena Orellana' },
      { id: 6, pid: 3, name: 'Ariana' }
    ]
  })
})
</script>
