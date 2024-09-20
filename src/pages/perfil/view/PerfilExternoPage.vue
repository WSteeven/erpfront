<template>
  <q-page padding class="q-pa-lg">
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-md-12 q-mb-md">
        <q-card>
          <q-card-section>
            <div class="relative-position container flex flex-center text-white q-mb-md">
              <q-img :src="
                perfil.foto_url != null
                  ? perfil.foto_url
                  : imagenPerfil
              " width="300px" height="416px" fit="cover">
              </q-img>
            </div>

            <div class="relative-position container flex flex-center text-h6">
              {{ perfil.nombres + ' ' + perfil.apellidos }}
            </div>
            <div class="relative-position container flex flex-center text-subtitle2">
              {{ perfil.email }}
            </div>

            <q-separator inset class="q-my-md"></q-separator>

            <div class="q-mb-md">
              <div class="relative-position container flex flex-center">
                Nombres: {{ (perfil.nombres + ' ' + perfil.apellidos).toUpperCase() }}
              </div>
              <div class="relative-position container flex flex-center">
                Correo: {{ perfil.email }}
              </div>
              <div class="relative-position container flex flex-center">
                Fecha de Nacimiento: {{ perfil.fecha_nacimiento }}
              </div>
              <div class="relative-position container flex flex-center">
                Dirección: {{ perfil.direccion }}
              </div>
              <div class="relative-position container flex flex-center">
                Identificación: {{perfil.tipo_documento_identificacion +': '+ perfil.numero_documento_identificacion }}
              </div>
              <div class="relative-position container flex flex-center">
                Teléfono: {{ perfil.telefono }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4 q-gutter-y-sm" v-if="false">
        <q-btn v-if="false" color="primary" class="full-width block" push no-caps @click="cambiarContrasena()">
          Cambiar Contraseña</q-btn>

        <q-card>
          <q-card-section v-if="perfil.roles">
            <div class="text-h6">Roles</div>
            <div class="q-py-xs">
              <q-item dense v-for="(rol, index) in perfil.roles" :key="index">
                <q-item-section avatar>
                  <q-icon name="bi-check-circle-fill" size="xs" color="positive"></q-icon>
                </q-item-section>
                <q-item-section>{{ rol }}</q-item-section>
              </q-item>
            </div>
          </q-card-section>
        </q-card>

        <q-card>
          <q-card-section v-if="perfil.permisos">
            <div class="text-h6">Permisos</div>
            <q-scroll-area style="height: 100vh">
              <div class="q-py-md">
                <q-item dense v-for="(permiso, index) in perfil.permisos" :key="index">
                  <q-item-section avatar>
                    <q-icon name="bi-check-circle-fill" size="xs" color="positive"></q-icon>
                  </q-item-section>
                  <q-item-section>{{ permiso }}</q-item-section>
                </q-item>
              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script src="./PerfilExternoPage.ts"></script>
