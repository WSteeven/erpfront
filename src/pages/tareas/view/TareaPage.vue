<template>
  <tab-layout
    :mostrar-button-submits="false"
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    tituloPagina="Control de tareas"
  >
    <template #formulario>
      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        animated
        bordered
        flat
      >
        <!-- General -->
        <q-step :name="1" title="General" icon="settings" :done="done1">
          <general-page></general-page>
        </q-step>

        <!-- Subtareas -->
        <q-step
          :name="2"
          title="Subtareas"
          icon="create_new_folder"
          :done="done2"
        >
          <subtareas-content></subtareas-content>
        </q-step>

        <!-- Solicitud de materiales -->
        <!--  <q-step
          :name="3"
          title="Solicitud de materiales"
          icon="add_comment"
          :done="done3"
        >
          <solicitud-materiales-content></solicitud-materiales-content>
        </q-step> -->

        <!-- Devolucion de materiales -->
        <!-- <q-step
          :name="4"
          title="Devolución de materiales"
          icon="create_new_folder"
          :done="done4"
        >
          <devolucion-materiales-content></devolucion-materiales-content>
        </q-step> -->

        <!-- Prefactura -->
        <!-- <q-step :name="5" title="Prefactura" icon="add_comment" :done="done5">
          <prefacturas-content></prefacturas-content>
        </q-step> -->
      </q-stepper>
    </template>
  </tab-layout>
</template>

<script src="./TareaPage.ts"></script>
