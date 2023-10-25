<template>
  <q-page>
    <div class="text-center text-subtitle2 q-mb-md">
      Ticket {{ ticket.codigo }}
    </div>

    <div class="column q-col-gutter-sm q-mb-md">
      <div class="col-12">
        <label class="q-mb-sm block">Asunto</label>
        <b>{{ ticket.asunto }}</b>
      </div>

      <div class="col-12">
        <label class="q-mb-sm block">Descripción</label>
        <b>{{ ticket.descripcion }}</b>
      </div>
    </div>

    <div id="responsables" class="row items-center">
      <div class="col-12 col-md-1">
        <div class="text-grey-7 text-subtitle2 text-shadow">
          Seleccione un responsable para filtrar actividades
        </div>
      </div>

      <div class="col-12 col-md-11 background-shadodw bg-grey-7d rounded">
        <q-scroll-area style="height: 250px; max-width: 100%" class="q-pa-sm">
          <div class="row q-gutter-md items-center no-wrap">
            <q-card
              class="custom-shadow2 rounded-card bg-grey-7 text-white cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="100px"></q-icon>
                <span class="text-primary">.</span>
                <b>Todas las actividades</b>
                <span>...</span>
              </q-card-section>
            </q-card>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="100px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon name="bi-chevron-right" size="md" color="grey-6"></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="100px" color="grey"></q-icon>
                <span class="text-primary">Informática</span>
                <b>Wilson Córdova</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon name="bi-chevron-right" size="md" color="grey-6"></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="100px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon name="bi-chevron-right" size="md" color="grey-6"></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="100px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon name="bi-chevron-right" size="md" color="grey-6"></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="100px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon name="bi-chevron-right" size="md" color="grey-6"></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="100px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>

            <q-icon name="bi-chevron-right" size="md" color="grey-6"></q-icon>

            <q-card
              class="custom-shadow2 no-border rounded-card cursor-pointer q-card-hover q-card-press"
              style="width: 180px"
            >
              <q-card-section class="column q-gutter-sm items-center">
                <q-icon name="boy" size="100px" color="grey"></q-icon>
                <span class="text-primary">Recursos Humanos</span>
                <b>Glenda Mendoza</b>
                <span>1 hora con 30 minutos</span>
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>
    </div>

    <q-card class="rounded-card custom-shadow no-border q-pa-md">
      <!--<div class="row justify-center q-gutter-md q-pt-xl q-pb-md">
        <div class="text-positive full-width text-center text-h3">6 horas</div>
        <div class="text-center full-width text-bold">
          Tiempo total del ticket
        </div>
      </div> -->

      <div class="row">
        <div class="col-12 q-mb-md">
          <tabla-filas-dinamicas
            :listado="actividadesRealizadas"
            :configuracion-columnas="columnasActividades"
            :entidad="ActividadRealizadaSeguimientoTicket"
            :accion1="verFotografia"
            :mostrarAccion1Header="permitirSubir"
            @guardarFila="(fila) => guardarFilaActividad(fila)"
          ></tabla-filas-dinamicas>
        </div>
        <!-- :editarFilaLocal="false" -->

        <div class="col-12 q-mb-md">
          <archivo-seguimiento
            ref="refArchivoSeguimiento"
            :mixin="mixinArchivoSeguimiento"
            :endpoint="endpoint"
            :permitir-subir="permitirSubir"
            :permitir-eliminar="permitirSubir"
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
          </archivo-seguimiento>
        </div>
      </div>
    </q-card>

    <visor-imagen ref="refVisorImagen"></visor-imagen>
  </q-page>
</template>

<script src="./SeguimientoTicketPage.ts"></script>

<style lang="scss" scoped>
#responsables {
  position: relative;
  bottom: -6px;
  // left: 20px;
  z-index: 10;
}

.background-shadow {
  background-image: linear-gradient(127deg, #f2f2f2 80%, #dee3e4);
}
</style>
