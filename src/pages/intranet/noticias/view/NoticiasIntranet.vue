<template>
  <q-page padding>
    <q-form @submit="submitForm">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Subir Noticia</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.title" label="Título" required />
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.author" label="Autor" required />
        </q-card-section>

        <q-card-section>
          <q-date v-model="form.date" label="Fecha de Publicación" required />
        </q-card-section>

        <q-card-section>
          <q-file v-model="form.image" label="Subir Imagen" accept="image/*" required />
        </q-card-section>

        <q-card-section>
          <q-editor v-model="form.description" label="Descripción" required />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" @click="resetForm" />
          <q-btn label="Subir" type="submit" color="positive" />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>
