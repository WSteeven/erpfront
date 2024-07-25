<template>
  <div>
    <h1>Detalles de la Noticia</h1>
    <div v-if="news" class="news-item">
      <img :src="news.image" alt="news image" />
      <h2>{{ news.title }}</h2>
      <p>{{ news.description }}</p>
      <router-link :to="news.link">Leer más</router-link>
    </div>
    <div v-else>
      <p>No se encontró la noticia.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getNewsById } from '../view/IntranetPage'; // Ajusta la ruta según la estructura de tu proyecto

export default defineComponent({
  name: 'NoticiaView',
  setup() {
    const news = ref<News | undefined>(undefined);
    const id = 0; // Aquí puedes definir el ID que deseas buscar

    onMounted(() => {
      news.value = getNewsById(id);
    });

    return {
      news
    };
  }
});
</script>

<style scoped>
.news-item {
  margin-bottom: 20px;
}

.news-item img {
  width: 100%;
  height: auto;
}
</style>