<template>
  <section class="p-4">
    <!-- Modal: nuevo negocio-->
    <div ref="refFormularioModal" class="modal fade">
      <div class="modal-dialog modal-xl modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ tituloModal }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <!-- Contenido del modal -->
          <div class="modal-body">
            <div class="card p-4">
              <slot name="formulario" />
              <button-submits
                :accion="accion"
                @cancelar="ocultar()"
                @guardar="guardar(entidad)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: asociarme a un negocio -->
    <div id="asociarmeModal" class="modal fade">
      <div class="modal-dialog modal-xl modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ tituloModal }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <!-- Contenido del modal -->
          <div class="modal-body">
            <div class="card p-4">
              <div class="row">
                <div class="col-12 mb-4">
                  <label class="form-label" for="name"
                    >Código de registro</label
                  >
                  <input
                    v-model="codigoRegistro"
                    type="text"
                    maxlength="8"
                    class="form-control"
                    placeholder="Obligatorio"
                  />
                </div>
                <div class="col d-grid d-md-flex justify-content-md-end">
                  <button
                    class="btn btn-primary"
                    type="submit"
                    @click="asociarme"
                  >
                    <i class="bi bi-arrow-left-right me-1" />
                    <span>Asociarme</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal: cards -->
    <h6 class="text-start fw-bold"><i class="bi-building"></i> Mis negocios</h6>
    <p class="my-4">Agregue y seleccione un negocio para continuar</p>
    <div class="row row-cols-1 row-cols-md-3 my-4">
      <div class="col mb-4">
        <div class="card card-image h-100">
          <img
            src="img/add_fill.svg"
            width="160"
            height="160"
            class="card-img-top p-5"
            style="object-fit: contain"
            alt="Logo del negocio"
          />
          <div class="card-body text-center">
            <a
              class="card-text stretched-link text-decoration-none fw-bold"
              @click="mostrar()"
            >
              Crear un negocio</a
            >
          </div>
        </div>
      </div>

      <div
        class="col mb-4"
        v-for="negocio in negociosPropietarioListado"
        :key="negocio.id"
      >
        <!-- route="/" -->
        <card-image
          :image-url="negocio.logo"
          :title="negocio.nombre"
          :subtitle="negocio.tipo"
          class="card-image"
          @clickEvent="cbSeleccionarCard(negocio.id)"
        ></card-image>
      </div>
    </div>

    <!-- Seccion 2 -->
    <h6 class="text-start fw-bold">
      <i class="bi-briefcase"></i> Negocios a los que estoy asociado
    </h6>
    <div class="row row-cols-1 row-cols-md-3 my-4">
      <div class="col mb-4">
        <div class="card card-image h-100">
          <img
            src="img/add_secondary_alt.svg"
            width="160"
            height="160"
            class="card-img-top p-5"
            style="object-fit: contain"
            alt="Logo del negocio"
          />
          <div class="card-body text-center">
            <a
              class="card-text stretched-link text-decoration-none fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#asociarmeModal"
            >
              Asociarme a un negocio</a
            >
          </div>
        </div>
      </div>

      <div
        class="col mb-4"
        v-for="negocio in negociosAsociadoListado"
        :key="negocio.id"
      >
        <card-image
          :image-url="negocio.logo"
          :title="negocio.nombre"
          :subtitle="negocio.tipo"
          route="/"
          class="card-image"
          @clickEvent="cbSeleccionarCard(negocio.id)"
        ></card-image>
      </div>
    </div>
  </section>
</template>

<script lang="ts" src="./CardTransaccionesSimples.ts"></script>

<style lang="scss" scoped>
.card-image {
  transition: all 0.2s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(1.04);
  }
}

a {
  cursor: pointer;
}
</style>
