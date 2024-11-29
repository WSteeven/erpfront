<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-lg">
      {{formulario.formulario}}
      <q-card-section>
        <label>{{formulario.nombre}}</label>
        <div v-for="(field, index) in formulario.formulario" :key="index" class="q-mb-md">
          <DynamicFields :campo="field"/>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Enviar" @click="handleSubmit" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./FormPage.ts" />
