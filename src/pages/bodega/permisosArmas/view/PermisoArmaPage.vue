<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="permisos_armas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <formulario-permiso-arma
          :permiso="permiso"
          :disable="disabled"
          :v$="v$"
        />
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./PermisoArmaPage.ts"></script>
