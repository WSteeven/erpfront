<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-md-12 q-mb-md">

        <q-card class="q-pa-md">
          <q-card-section>

              <q-form @submit.prevent="agregarEvento">
                <div class="row q-col-gutter-sm q-mb-md">
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                  <q-input v-model="evento.titulo" label="Título" dense outlined required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                <q-select v-model="evento.tipo" label="Tipo de Evento" outlined :options="tiposEvento" dense required /></div>
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                <q-input v-model="evento.inicio" label="Fecha y Hora de Inicio" type="datetime" dense outlined required /></div>
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                <q-input v-model="evento.fin" label="Fecha y Hora de Fin" type="datetime" dense outlined required /></div>
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Titulo</label>
                <q-input v-model="evento.descripcion" label="Descripción" dense outlined textarea /></div>

                <q-btn type="submit" color="primary" label="Agregar Evento" />
              </div>
              </q-form>


          </q-card-section>
        </q-card>

      </div>
      <div class="col-12 col-md-8 q-mb-md">

        <div>
          <q-splitter v-model="splitterModel" style="height: 450px">

            <template v-slot:before>
              <div class="q-pa-md">
                <q-date v-model="date" :events="events" event-color="orange" />
              </div>
            </template>

            <template v-slot:after>
              <q-tab-panels v-model="date" animated transition-prev="jump-up" transition-next="jump-up">
                <q-tab-panel name="2019/02/01">
                  <div class="text-h4 q-mb-md">2019/02/01</div>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
                    quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla
                    ullam. In, libero.</p>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
                    quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla
                    ullam. In, libero.</p>
                </q-tab-panel>

                <q-tab-panel name="2019/02/05">
                  <div class="text-h4 q-mb-md">2019/02/05</div>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
                    quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla
                    ullam. In, libero.</p>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
                    quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla
                    ullam. In, libero.</p>
                </q-tab-panel>

                <q-tab-panel name="2019/02/06">
                  <div class="text-h4 q-mb-md">2019/02/06</div>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
                    quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla
                    ullam. In, libero.</p>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
                    quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla
                    ullam. In, libero.</p>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
                    quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla
                    ullam. In, libero.</p>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script src="./EventoPage.ts"></script>