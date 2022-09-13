<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Autorizaciones">
        <template #formulario>
            <q-form @submit.prevent>
                <div class="row q-col-glutter-sm q-py-md">
                    <div class="col-12 col-md-6">
                        <label class="q-mb-sm block">Nombre de la Autorizacion</label>
                        <q-input v-model="autorizacion.nombre" placeholder="Obligatorio" :readonly="disabled"
                            :error="!!v$.nombre.$errors-length"
                            @update:model-value="(v)=>(autorizacion.nombre=v.toUpperCase())" outlined dense>
                            <template v-slot:error>
                                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                                    <div class="error-msg">{{error.$message}}</div>
                                </div>
                            </template>
                        </q-input>
                    </div>
                </div>
            </q-form>
        </template>
    </tab-layout>
</template>

<script src="./AutorizacionPage.ts"></script>