<template>
  <q-page padding>

    <q-banner v-if="showBanner" inline-actions class="text-white bg-orange">
      Noticia de Emergencia o Flash Informativo
      (Aqui iria la breve descripcion de la noticia o el suceso)
      <template v-slot:action>
        <q-btn flat color="white" label="VER NOTICIA" />
      </template>
    </q-banner>

    <!-- Columns start at 33.3% wide on mobile and bump up to 50% wide on desktop -->

    <!--Noticias-->
    <div class="row q-col-gutter-sm q-mt-md q-mx-md q-mb-md">
      <div class="col-4 col-md-9">
        <q-carousel style="border-radius: 15px;  overflow: hidden;" animated v-model="slide" navigation infinite
          :autoplay="autoplay" arrows transition-prev="slide-right" transition-next="slide-left"
          @mouseenter="autoplay = false" @mouseleave="autoplay = true">
          <q-carousel-slide :name="1"
            img-src="https://scontent.fgye6-1.fna.fbcdn.net/v/t39.30808-6/280909558_167743922313120_2167845019031983415_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=K5UyHTCBbiAQ7kNvgE5eTYq&_nc_ht=scontent.fgye6-1.fna&oh=00_AYABk8STOQ75BaOkE7zaIOV6K7tJ9rvKCOPt1VL2klQSrA&oe=66669283">
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Primera Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="2"
            img-src="https://scontent.fgye6-1.fna.fbcdn.net/v/t39.30808-6/270064574_138688685218644_2198513694774741938_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qF4wclsMMgsQ7kNvgH0pcEA&_nc_ht=scontent.fgye6-1.fna&oh=00_AYDaGL7lazKWYfZKC37NdtMjirv6nJBVru63C-KKaa1QYQ&oe=66669086">
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Segunda Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="3"
            img-src="https://scontent.fgye6-1.fna.fbcdn.net/v/t39.30808-6/270261368_138680225219490_8699679275314585232_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=xLr3tNpgY6oQ7kNvgGjOfvj&_nc_ht=scontent.fgye6-1.fna&oh=00_AYAC0rOGeVUHFfaoH73Lg-PjgxCQNIrDYfq2tlkckCcQNw&oe=666684B3">
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Tercer Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="4"
            img-src="https://scontent.fgye6-1.fna.fbcdn.net/v/t39.30808-6/270099371_138680228552823_3200591332946486219_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=8nX_-CphP0oQ7kNvgHxoZTS&_nc_ht=scontent.fgye6-1.fna&oh=00_AYBK-osFvxOo3Lptek5WO5FTiDhfDeSbJ7fKhmEoEbe7hw&oe=6666741C">
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Cuarta Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
        </q-carousel>



      </div>
      <div class="col-4 col-md-3">
        <q-input v-model="search" filled type="search" hint="" placeholder="Buscar"
          style="border-radius: 15px;  overflow: hidden;">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-card class="my-card" style="border-radius: 15px;  overflow: hidden;">
          <div class="row q-pa-md">
            <div class="col-auto">
              <div class="relative-position">
                <q-img :src="imagenPerfil" width="100px" height="100px" fit="cover" class="rounded-full" />
              </div>
            </div>
            <div class="col">
              <q-card-section class="text-left">
                {{ store.nombreUsuario }}
                <q-badge color="primary">{{ store.user?.email }}</q-badge>
                <q-badge rounded color="orange">{{ store.user?.cargo }}
                </q-badge>
              </q-card-section>
            </div>
          </div>
        </q-card>
        <q-separator />
        <div class="flex flex-center">
          <div class="row q-col-gutter-lm q-mt-md q-mx-md">
            <div class="col-6">
              <q-card flat class="my-card rounded-borders banner-transparent">
                <q-img src="https://templates-flatlogic.herokuapp.com/vue-material/img/folder-green.3bc0a33b.svg"
                  style="max-width: 100px; max-height: 100px;">
                  <div class="absolute-full text-caption banner-transparent">
                    <div class="text-body2 q-my-lg">
                      <q-btn outline rounded color="clare" label="Instructivos" class="custom-border-button"
                        target="_blank"
                        href="https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770" />
                    </div>
                  </div>
                </q-img>
                <q-card-actions></q-card-actions>
              </q-card>
            </div>
            <div class="col-6 margen-pequeno">
              <q-card flat class="my-card rounded-borders banner-transparent">
                <q-img src="https://templates-flatlogic.herokuapp.com/vue-material/img/folder-yellow.d553d1c6.svg"
                  width="175px" height="125px">
                  <!-- Ajustar el tamaño de la imagen -->
                  <div class="absolute-full text-caption banner-transparent">
                    <!-- Cambiar el tamaño del texto -->
                    <div class="text-body2 q-my-lg">
                      <q-btn outline rounded color="clare" label="Normativas" class="custom-border-button"
                        target="_blank"
                        href="https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770" />
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


    <div class="row q-col-gutter-sm q-ml-sm q-pl-sm">
      <div class="col-6 col-md-3">
        <label class="q-mb-sm block"><strong>Calendario de Eventos</strong></label>
        <q-date v-model="date" :mask="maskFecha" :events="eventos"
          :event-color="(date) => (date[9] % 2 === 0 ? 'teal' : 'orange')" minimal @update:model-value="verEvento(date)"
          style="width: max-content" />
        <!--  -->
        <q-card class="solicitudes q-my-md">
          <q-card-section>
            <div class="text-h6">SOLICITUDES</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-select v-model="solicitud.tipo_solicitud" label="Tipo de Solicitud" outlined
              :options="tiposSolicitudes" />
            <q-input v-model="solicitud.descripcion" label="Descripción" outlined type="textarea" rows="3" />
          </q-card-section>
          <q-card-actions class="justify-end">
            <q-btn flat @click="limpiarFormulario" color="primary">Limpiar</q-btn>
            <q-btn @click="enviarSolicitud" color="primary" flat>Enviar</q-btn>
          </q-card-actions>
        </q-card>
      </div>

    <!--Mis Modulos-->
      <div class="col-6 col-md-4">
        <q-separator></q-separator>
        <label><strong>Mis Módulos</strong></label>

        <q-card class="my-card" flat bordered>

          <q-list>
            <q-item clickable v-for="(modulo, index) in modulosPermitidos" :key="index" :to="modulo.link">
              <q-item-section avatar>
                <q-icon color="primary" :name="modulo.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{modulo.title}}</q-item-label>
                
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>



      <q-separator></q-separator>
      <div class="col-9 col-md-3 items-lg-end">
          <q-expansion-item class="overflow-hidden q-mb-md expansion"
            :label="'Departamentos (' + departamentos.length + ')'" header-class="text-bold bg-header-collapse">
            <q-card v-if="showDepartamentos">
              <q-card-section>
                <q-list bordered class="rounded-borders">
                  <q-expansion-item v-for="(departamento, index) in departamentos" :key="index" expand-separator
                    :label="index + 1 + '. ' + departamento.nombre" group="evento" dense
                    :caption="departamento.responsable" @click="consultarEmpleadosDepartamento(departamento.id)">
                    <q-card v-for="(empleado, index) in empleados" :key="index">
                      <div class="row q-col-gutter-sm q-my-xs q-mx-md">
                        <div class="col-6 col-md-2">
                          <q-avatar>
                            <img :src="empleado.foto_url == null
                              ? `https://ui-avatars.com/api/?name=${empleado.nombres.substr(
                                0,
                                1
                              )}+${empleado.apellidos.substr(
                                0,
                                1
                              )}&bold=true&background=0879dc28&color=0879dc`
                              : empleado.foto_url
                              " />
                          </q-avatar>
                        </div>
                        <div class="col-6 col-md-10 q-my-md margen-pequeno">
                          <p class="margen-pequeno">
                            {{ empleado.nombres + ' ' + empleado.apellidos }}
                          </p>
                          <small>{{ empleado.cargo }}</small>
                        </div>
                      </div>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>

    </div>


    <!-- Componente de modales -->
    <modales-entidad :comportamiento="modales" :fullWidth="false" :maximized="false" :persistente="false" />
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

<script src="./IntranetPage.ts"></script>
