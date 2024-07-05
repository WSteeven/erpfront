<template>
  <div class="row justify-between">
    <label class="q-mb-sm block" v-if="label">{{ label }}</label>
    <label class="q-mb-sm block" v-else>Descripción</label>
    <b class="text-italic">*No enviar imágenes demasiado grandes</b>
  </div>
  <q-editor
    v-model="internalValue"
    min-height="5rem"
    :toolbar="toolbar"
    :disable="disable"
    toolbar-bg="blue-grey-2"
    toolbar-text-color="black"
    toolbar-toggle-color="primary"
    @input="updateValue"
  >
  </q-editor>
  <div v-if="error">
    <div
      v-for="error of v$[v_error_key].$errors"
      :key="error.$uid"
      class="text-negative text-uppercase"
    >
      {{ error.$message }}
    </div>
  </div>
</template>

<script src="./EssentialEditor.ts" />
