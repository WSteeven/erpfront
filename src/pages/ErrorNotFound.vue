<template>
  <div class="container">
    <div class="gif">
      <img src="https://i.postimg.cc/2yrFyxKv/giphy.gif" alt="gif_ing" />
    </div>
    <div class="content">
      <h1 class="main-heading">Esta Pagina no está disponible.</h1>
      <p>
        ...quizás la página que estás buscando no se encuentra o nunca existió.
      </p>
      <p>
        <b>!! NO ROMPAS LA PANTALLA !!</b>
        <br>
        Contacta a tu administrador.
      </p>

      <br>
      <a href="/intranet">
        <button>Volver a Intranet &nbsp; <i class="fa-solid fa-house"></i></button>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound'
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

.gif {
  display: flex;
  justify-content: center;
}

.content {
  text-align: center;
  margin: 3rem 0;
}

.content .main-heading {
  font-size: 2.5rem;
  font-weight: 700;
}

p {
  font-size: 1.3rem;
  padding: 0.7rem 0;
}

button {
  padding: 1rem;
  border-radius: 15px;
  outline: none;
  border: none;
  background: #ff6c17;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
}
</style>
