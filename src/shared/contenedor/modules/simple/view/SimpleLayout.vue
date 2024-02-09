<template>
  <q-page :padding="!$q.screen.xs">
    <transition name="scale" mode="out-in">
      <slot name="modales" />
    </transition>

    <div class="bg-desenfoque-s2">
      <slot name="formulario" />
    </div>

    <div class="row justify-end q-col-gutter-x-xs">
      <button-submits
        v-if="mostrarButtonSubmits"
        :accion="accion"
        :permitirGuardar="puedeCrear"
        :disabled="storeCargando.cargando"
        :labelGuardar="labelGuardar"
        @cancelar="reestablecer()"
        @editar="editar(entidad, resetFormularioOnUpdate)"
        @eliminar="eliminar(entidad, cbEliminar)"
        @guardar="guardar(entidad)"
      />
    </div>
  </q-page>
</template>

<script src="./SimpleLayout.ts"></script>
