<template>
  <div class="page_404 fullscreen text-grey-8 text-center q-pa-md flex flex-center">
    <div>
      <div class="four_zero_four_bg">
        <h2 class="text-center">404</h2>
      </div>

      <div class="contant_box_404">
        <h6 class="h6">
          No se encuentra el recurso solicitado
        </h6>
        <q-btn
          class="q-mt-xl link_404"
          color="grey-8"
          unelevated
          to="/"
          label="Ver tablero"
          no-caps
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound'
};
</script>

<style scoped>
/*======================
    404 page
=======================*/

.page_404 {
  padding: 40px 0;
  background: #fff;
  font-family: 'Arvo', serif;
}

.page_404 img {
  width: 100%;
}

.four_zero_four_bg {
  background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
  height: 400px;
  background-position: center;
}

.four_zero_four_bg h1 {
  font-size: 30vh;
}

.four_zero_four_bg h3 {
  font-size: 2em;
  opacity: 0.4;
}

.link_404 {
  color: #fff !important;
  padding: 10px 20px;
  background: #39ac31;
  margin: 20px 0;
  display: inline-block;
}

.contant_box_404 {
  margin-top: -50px;
}
</style>
