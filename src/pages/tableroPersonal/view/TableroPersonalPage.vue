<template>
  <q-page padding>
    <q-banner v-if="showBanner" inline-actions class="text-white bg-orange">
      Noticia de Emergencia o Flash Informativo (Aqui iria la breve descripcion de la
      noticia o el suceso)
      <template v-slot:action>
        <q-btn flat color="white" label="VER NOTICIA" />
      </template>
    </q-banner>

    <!-- Columns start at 33.3% wide on mobile and bump up to 50% wide on desktop -->
    <div class="row q-col-gutter-sm q-mt-md q-mx-md q-mb-md">
      <div class="col-4 col-md-8">
        <q-carousel
          animated
          v-model="slide"
          navigation
          infinite
          :autoplay="autoplay"
          arrows
          transition-prev="slide-right"
          transition-next="slide-left"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = true"
        >
          <q-carousel-slide
            :name="1"
            img-src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu9oEYyY5HK3BpL2GsAOV6wHrbHb1FkoTGu2pKqXKNlw&s"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Primera Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide
            :name="2"
            img-src="https://media.licdn.com/dms/image/C5622AQGTv_MeiL8E9A/feedshare-shrink_800/0/1652387694729?e=2147483647&v=beta&t=VUJzxfpA4GRO2jKQ2pWDXnR8LNfh6IuirXfr1dZvODU"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Segunda Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide
            :name="3"
            img-src="https://media.licdn.com/dms/image/C4D22AQHURssxoX0FAQ/feedshare-shrink_800/0/1643980715005?e=2147483647&v=beta&t=HLwKY4gOCsBPIBzusmztCrpCckmg858lLRvzotJFOK8"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Tercer Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide
            :name="4"
            img-src="https://media.licdn.com/dms/image/C4E22AQFcGv81a4EkZg/feedshare-shrink_800/0/1640622491601?e=2147483647&v=beta&t=h-G900B6dvVy8Lp45OlGGSqA3foD5opmAFBmgeIYGgo"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Cuarta Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      <div class="col-4 col-md-4">
        <q-input v-model="search" filled type="search" hint="" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-card class="my-card">
          <div class="row q-pa-md">
            <div class="col-auto">
              <div class="relative-position">
                <q-img
                  :src="imagenPerfil"
                  width="100px"
                  height="100px"
                  fit="cover"
                  class="rounded-full"
                />
              </div>
            </div>
            <div class="col">
              <q-card-section class="text-left">
                {{ store.nombreUsuario }}
                <q-badge color="primary">{{ store.user.email }}</q-badge>
                <q-badge rounded color="orange">{{ store.user.cargo }} </q-badge>
              </q-card-section>
            </div>
          </div>
        </q-card>
        <q-separator />
        <div class="flex flex-center">
          <div class="row q-col-gutter-lm q-mt-md q-mx-md">
            <div class="col-6">
              <q-card flat class="my-card rounded-borders banner-transparent">
                <q-img
                  src="https://templates-flatlogic.herokuapp.com/vue-material/img/folder-green.3bc0a33b.svg"
                  width="175px"
                  height="125px"
                >
                  <!-- Ajustar el tamaño de la imagen -->
                  <div class="absolute-full text-caption banner-transparent">
                    <!-- Cambiar el tamaño del texto -->
                    <div class="text-body2 q-my-lg">
                      <q-btn
                        outline
                        rounded
                        color="clare"
                        label="Instructivos"
                        class="custom-border-button"
                        target="_blank"
                        href="https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770"
                      />
                    </div>
                  </div>
                </q-img>
                <q-card-actions> </q-card-actions>
              </q-card>
            </div>
            <div class="col-6 margen-pequeno">
              <q-card flat class="my-card rounded-borders banner-transparent">
                <q-img
                  src="https://templates-flatlogic.herokuapp.com/vue-material/img/folder-yellow.d553d1c6.svg"
                  width="175px"
                  height="125px"
                >
                  <!-- Ajustar el tamaño de la imagen -->
                  <div class="absolute-full text-caption banner-transparent">
                    <!-- Cambiar el tamaño del texto -->
                    <div class="text-body2 q-my-lg">
                      <q-btn
                        outline
                        rounded
                        color="clare"
                        label="Normativas"
                        class="custom-border-button"
                        target="_blank"
                        href="https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770"
                      />
                    </div>
                  </div>
                </q-img>
                <q-card-actions> </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-6 col-md-3">
        <q-date
          v-model="date"
          :events="eventos"
          @update:model-value="verEvento(date)"
          :event-color="(date) => (date[9] % 2 === 0 ? 'teal' : 'orange')"
          minimal
          style="width: max-content;"

        />
        <q-card class="solicitudes q-my-md">
          <q-card class="solicitudes q-my-md">
            <q-card-section>
              <div class="text-h6">SOLICITUDES</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-select
                v-model="tipoSolicitud"
                label="Tipo de Solicitud"
                outlined
                :options="tiposSolicitud"
              />
              <q-input
                v-model="descripcion"
                label="Descripción"
                outlined
                type="textarea"
                rows="3"
              />
            </q-card-section>
            <q-card-actions vertical>
              <q-btn @click="enviarSolicitud" color="primary" flat>Enviar</q-btn>
              <q-btn flat @click="limpiarFormulario" color="primary">Limpiar</q-btn>
            </q-card-actions>
          </q-card>
        </q-card>
      </div>
      <div class="col-3 col-md-3">
        <q-card class="my-card">
          <img src="https://cdn.quasar.dev/img/mountains.jpg" />

          <q-card-section>
            <div class="text-h6">Noticia</div>
            <div class="text-subtitle2">Autor Noticia</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ lorem }}
            <q-pagination
              v-if="data.length > 2"
              class="q-pa-md row q-gutter-md justify-center align-center"
              v-model="currentPage"
              :boundary-links="true"
              :direction-links="true"
              :round="true"
              :per-page="perPage"
              :max="Math.ceil(data.length / perPage)"
              :total="Math.ceil(data.length / perPage)"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-md-3 items-lg-end">
        <q-card class="q-pa-md" v-if="showDepartamentos">
          <q-card-section>
            <q-list bordered class="rounded-borders">
              <q-expansion-item
                v-for="(departamento, index) in departamentos"
                :key="index"
                expand-separator
                :label="departamento.nombre"
                group="evento"
                dense
                :caption="departamento.responsable"
                @click="consultarEmpleadoDepartamento(departamento.id)"
              >
                <q-card           v-for="(empleado, index) in empleados"
                :key="index">
                  <div class="row q-col-gutter-sm q-my-xs q-mx-md">
                    <div class="col-6 col-md-2">
                  <q-avatar>
                    <img  :src="empleado.foto_url == null? `https://ui-avatars.com/api/?name=${empleado.nombres.substr(0, 1)}+${empleado.apellidos.substr(0, 1)}&bold=true&background=0879dc28&color=0879dc`: empleado.foto_url" />
                  </q-avatar>
                    </div>
                    <div class="col-6 col-md-10 q-my-md margen-pequeno">
                      <p class="margen-pequeno">{{ empleado.nombres+' '+empleado.apellidos }}</p>
                    </div>
                  </div>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-6 col-md-3"></div>
      <div class="col-6 col-md-6 flex flex-center"></div>
      <div class="col-6 col-md-3 items-lg-end"></div>
    </div>

    <!-- Componente de modales -->
    <modales-entidad
      :comportamiento="modales"
      :fullWidth="false"
      :maximized="false"
      :persistente="false"
    />
  </q-page>
</template>

<style>
.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}

.banner-transparent {
  background: rgba(0, 0, 0, 0) !important;
  margin-top: 8%;
  border: none !important;
}
.margen-pequeno {
  padding-left: 4%;
  padding-right: 4%;
}
</style>

<script src="./TableroPersonalPage.ts"></script>
