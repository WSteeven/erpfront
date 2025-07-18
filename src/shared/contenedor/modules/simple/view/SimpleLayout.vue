<template>
  <div :padding="!$q.screen.xs" class="bg-desenfoque rounded q-pa-md">
    <transition name="scale" mode="out-in">
      <slot name="modales" />
    </transition>

    <div class="bg-desenfoque-s2">
      <slot name="formulario" />
    </div>

    <div class="row justify-end q-col-gutter-x-xs q-pt-md q-mt-xl">
      <span>
        <slot name="custom-buttons"></slot>
      </span>
      <button-submits
        v-if="mostrarButtonSubmits"
        :accion="accion"
        :permitirGuardar="puedeCrear || forzarGuardar"
        :permitirModificar="puedeEditar"
        :permitirCancelar="permitirCancelar"
        :disabled="storeCargando.cargando"
        :labelEditar="labelEditar"
        :labelGuardar="labelGuardar"
        @cancelar="reestablecer()"
        @editar="editar(entidad, resetFormularioOnUpdate)"
        @eliminar="eliminar(entidad, cbEliminar)"
        @guardar="guardar(entidad)"
      />
    </div>
  </div>
</template>

<script src="./SimpleLayout.ts"></script>
