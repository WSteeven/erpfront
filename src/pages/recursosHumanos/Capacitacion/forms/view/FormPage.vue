<template>
  <basic-container>
    <template #contenido>
      <q-page class="row justify-center q-pa-md">
        <q-card class="col-8 q-pa-lg">
          <!--      {{formulario.formulario}}-->
          <q-card-section>
            <div class="text-h6">
              <q-icon size="xs" class="q-mr-sm" name="bi-clock-fill" />
              <label>{{ time }}</label>
            </div>
          </q-card-section>
          <q-card-section>
            <h4 class="text-center">{{ formulario.nombre }}</h4>
            <div
              v-for="(field, index) in formulario.formulario"
              :key="index"
              class="q-mb-md"
            >
              <q-separator />
              <DynamicFields :campo="field" />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn color="primary" label="Enviar" @click="handleSubmit" />
          </q-card-actions>
        </q-card>
      </q-page>
    </template>
  </basic-container>
</template>
<script src="./FormPage.ts" />
