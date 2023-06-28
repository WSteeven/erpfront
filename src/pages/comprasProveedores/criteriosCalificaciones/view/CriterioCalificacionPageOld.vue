<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores"
    :accion1="botonVerLogs"
    :mostrarButtonSubmits="
      departamento !== undefined && departamento.length > 0 ? true : false
    "
  >
    <template #formulario>
      <q-form
        @submit.prevent
        v-if="departamento != undefined && departamento.length > 0"
      >
      {{ criterio }}
        Criterios de calificaciones para el departamento de
        <strong>{{ departamento[0].nombre }}</strong>
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12">
            <tabla-filas-dinamicas
              :listado="criteriosRealizados"
              :configuracionColumnas="columnas"
              titulo="Criterios de calificación para bienes"
              :entidad="CriterioCalificacion"
              :permitirEditar="true"
              :permitirEliminar="true"
              :mostrarAccion1Header="true"
              :@guardarFila="(fila) => guardarFilaCriterio(fila)"
              :editarFilaLocal="true"
            ></tabla-filas-dinamicas>
          </div>
        </div>
      </q-form>
      <q-form v-else>
        <div class="col col-12 text-center">
          <strong
            ><h3>No tienes autorizacion de modificar este formulario</h3>
            <h5>Unicamente puede hacerlo el responsable del departamento</h5>
          </strong>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./CriterioCalificacionPage.ts"></script>
