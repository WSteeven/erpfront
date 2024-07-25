<template>
  <div class="news-list">
    <div v-for="(news, index) in newsList" :key="index" class="news-item">
      <img :src="news.image" alt="news image" />
      <h2>{{ news.title }}</h2>
      <p>{{ news.description }}</p>
      <router-link :to="{ name: 'NewsDetail', params: { id: index } }"
        >Leer más</router-link
      >
    </div>
  </div>
</template>

<script src="./IntranetPage.ts"></script>

<style scoped>
.news-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.news-item {
  border: 1px solid #ccc;
  padding: 16px;
  width: calc(33.333% - 32px);
  box-sizing: border-box;
}

.news-item img {
  max-width: 100%;
  height: auto;
}
</style>