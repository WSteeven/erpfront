<template>
  <q-file
    v-if="!esArchivoRemoto"
    :outlined="outlined"
    clearable
    :dense="dense"
    :disable="disable"
    :accept="formato"
    :max-files="maxFiles"
    :max-total-size="maxTamanioBytes"
    :readonly="readonly"
    v-model="model"
    @update:model-value="update"
    @rejected="onRejected"
    :hint="hint"
    @blur="v$[clave].$touch"
    :error="!!v$[clave].$errors.length"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>

    <template v-slot:error>
      <slot name="error" v-if="slotUsado"></slot>
      <slot name="error" v-else>
        <error-component :clave="clave" :v$="v$" />
      </slot>
    </template>

    <template v-slot:append>
      <q-icon
        v-if="mostrarDescargar"
        name="download"
        @click.stop.prevent="descargar"
        class="cursor-pointer"
      />
    </template>
  </q-file>
  <input-component
    v-else
    :clearable="accion==acciones.editar"
    :readonly="disable"
    v-model="model"
    :v$="v$"
    :clave="clave"
    @update:model-value="update"
  >
    <template v-slot:append>
      <q-icon
        name="download"
        @click.stop.prevent="descargar"
        class="cursor-pointer"
      />
    </template>
  </input-component>
</template>
<script src="./FileComponent.ts"/>