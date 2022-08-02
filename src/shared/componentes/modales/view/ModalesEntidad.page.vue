<template>
  <div ref="refModalEntidades" class="modal fade">
    <div class="modal-dialog modal-xl modal-fullscreen-sm-down">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ titulo }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <component :is="componente"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ModalesEntidad.page.ts"></script>
