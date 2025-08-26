<template>
  <div
    class="footer q-pa-xs text-grey-8 text-uppercase q-safe-area-bottom"
    :class="{
      'text-right': !$q.platform.is.mobile,
      'text-center q-mt-lg': $q.platform.is.mobile
    }"
  >
    <small>
      <strong>Copyright © 2023</strong>. Todos los derechos reservados por
      <strong>JP Construcred c. ltda.</strong>
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
  margin-top: auto;
}

@media (min-width: 601px) {
  .footer { position: static; }
}
@media (max-width: 600px) {
  .footer { position: static; }
}
</style>
