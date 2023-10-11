<template>
  <q-page>
    <div class="text-center text-subtitle2 q-mb-md">Ingreso de novedad</div>
    <q-card class="rounded-card custom-shadow q-pa-md">
      <div class="row">
        <div class="col-12 q-mb-md">
          <tabla-filas-dinamicas
            :listado="listado"
            :configuracion-columnas="columnas"
            :entidad="NovedadOrdenCompra"
            :accion1="verFotografia"
            :mostrarAccion1Header="permitirSubir"
            @guardarFila="(fila) => guardarFilaActividad(fila)"
          ></tabla-filas-dinamicas>
        </div>
        <!-- :editarFilaLocal="false" -->

        <div class="col-12 q-mb-md">
          <gestor-archivos
            ref="refArchivo"
            :mixin="mixinOrdenCompra"
            :permitir-subir="permitirSubir"
            :permitir-eliminar="permitirSubir"
            @inicializado="cargarArchivos"
            :idModelo="16"
          >
            <template #boton-subir>
              <q-btn
                v-if="mostrarBotonSubir"
                color="positive"
                push
                no-caps
                class="full-width q-mb-lg"
                @click="subirArchivos()"
              >
                <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                Subir archivos seleccionados</q-btn
              >
            </template>
          </gestor-archivos>
        </div>
      </div>
    </q-card>

    <visor-imagen ref="refVisorImagen"></visor-imagen>
  </q-page>
</template>
<script src="./SeguimientoOrdenCompraPage.ts"></script>
