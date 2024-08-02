<template>
  <div class="news-list">
    <div class="news-item" v-for="news in newsList" :key="news.title">
      <img :src="news.image" alt="News Image" class="news-image">
      <div class="news-content">
        <h2 class="news-title">{{ news.title }}</h2>
        <p class="news-description">{{ news.description }}</p>
        <a :href="news.link" class="news-link">Leer más</a>
      </div>
    </div>
  </div>
</template>

<script src="./IntranetPage.ts"></script>


<style scoped>
.news-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.news-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  width: 300px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.news-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.news-content {
  padding: 15px;
}

.news-title {
  font-size: 18px;
  margin: 0 0 10px;
}

.news-description {
  font-size: 14px;
  margin: 0 0 15px;
}

.news-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.news-link:hover {
  text-decoration: underline;
}
</style>
