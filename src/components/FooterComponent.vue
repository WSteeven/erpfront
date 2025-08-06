<template>
  <div
      class="footer q-pa-xs"
      :class="{
      'text-right': !$q.platform.is.mobile,
      'text-center q-mt-lg': $q.platform.is.mobile
    }"
  >
    <small>
      <strong>Copyright © 2023</strong>. Todos los derechos reservados por
      <strong>JPCONSTRUCRED</strong>.
    </small>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
const $q = useQuasar()
</script>

<style scoped>
.footer {
  width: 100%;
}

/* En escritorio: se fija abajo */
@media (min-width: 601px) {
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

/* En móvil: no se fija, se muestra al final del scroll */
@media (max-width: 600px) {
  .footer {
    position: static;
  }
}
</style>
