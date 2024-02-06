<template>
  <div :class="!$q.screen.xs? 'centrar-card':'row'">
    <div class="formulario">
      <q-page class="flex flex-center" style="wiht: 12%">
        <q-card flat bordered class="my-card bg-grey-1">
          <q-card-section>
            <div class="text-primary text-bold q-mb-md">Cuestionario psicosocial</div>
            <div class="row">
              <div
                v-for="item in preguntas"
                :key="item.id"
                class="col-12 text-bold q-mb-md"
              >
                <label class="q-mb-sm block">{{
                  item.codigo + ".- " + item.pregunta
                }}</label>
                <q-option-group
                  v-model="item.respuesta"
                  :options="mapearArray(item.posibles_respuestas)"
                  color="primary"
                  dense
                />
              </div>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions align="around">
            <button-submits
              :accion="accion"
              label-guardar="Guardar"
              :permitirCancelar="true"
              @guardar="guardarDatos()"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </div>
  </div>
</template>
<style>
  .centrar-card{
    display: block;
    justify-content: center;
    align-items: center;
    margin-left: 25%;
    margin-right: 25%;
  }
  .formulario{
width: 800px; /* Ancho deseado de tu formulario */
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
</style>
<script src="./CuestionarioPsicosocialPage.ts"></script>
