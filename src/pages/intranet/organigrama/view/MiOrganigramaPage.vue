<template>
  <div class="col-12" id="tree"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import OrgChart from '@balkangraph/orgchart.js'

const chart = ref({})

onMounted(() => {
  // Configuración de opciones iniciales
  const options = getOptions();


  // Inicialización del OrgChart
  chart.value = new OrgChart(document.getElementById('tree'), {
    mouseScrool: OrgChart.action.ctrlZoom,
    scaleInitial: options.scaleInitial,
    enableSearch: options.enableSearch,
    template: "isla",
    padding: 20,
    subtreeSeparation: 50,
    miniMap: true,
    enableSearch: false,
    enableDragDrop: false,
    collapse: { level: 3, allChildren: true }, // Colapsa todos los nodos al inicio
    layout: OrgChart.layout.grid,
    mixedHierarchyNodesSeparation: 5,
    align: OrgChart.ORIENTATION,




    //Empleados en dos departamentos
    slinks: [
      { from: "AUXILIAR_BODEGA", to: "COORDINACION TELCONET" }
    ],

    toolbar: {
      fullScreen: true,
      zoom: true,
      fit: true,
      expandAll: true
    },
    nodeBinding: {
      field_0: "Empleado",
      field_1: "Cargo",
      //img_0: "img"
    },
    scaleInitial: options.scaleInitial,

    tags: {
        "AUDITOR_INTERNO": {
            template: "ula",
        }
    },


  });

  // Cargar los nodos del organigrama
  chart.value.load([

    // Directorio
    { id: "DIRECTORIO", tags: ["DIRECTORIO"], Empleado: "GERENCIA" },

    // Presidentes y Accionistas al mismo nivel
    { id: "ACCIONISTA", pid: "DIRECTORIO", tags: ["ACCIONISTA"], Empleado: "Jean Patricio Pazmiño Barros", Cargo: "Accionista", img: "/storage/fotosPerfiles/HbMVQIG5Uw.jpeg" },
    { id: "PRESIDENTE", pid: "DIRECTORIO", tags: ["PRESIDENTE"], Empleado: "Yanina Vanessa Loja Torres", Cargo: "Presidente", img: "/storage/fotosPerfiles/qhL7YouZh4.jpeg" },
    { id: "GERENTE_PROCESOS", pid: "DIRECTORIO", tags: ["GERENTE_PROCESOS"], Empleado: "Veronica Valencia", Cargo: "Gerente de Procesos" },


    // Gerente General, debajo de los presidentes/accionistas
    { id: "GERENTE_GENERAL", pid: "DIRECTORIO", tags: ["GERENTE_GENERAL"], Empleado: "Wellington Fernando Barros Sanchez", Cargo: "Gerente General", img: "/storage/fotosPerfiles/6sfs4jX8jH.jpeg" },

    // Auditor Interno como agente externo (línea punteada)
    { id: "AUDITOR_INTERNO", pid: "DIRECTORIO", tags: ["AUDITOR_INTERNO", "external"], Empleado: "Jairo Alexander Quiñones Montaño", Cargo: "Auditor Interno", img: "/storage/fotosPerfiles/PnSjTUnQQ1.jpeg" },

    // Contador Externo
    { id: "CONTADOR_EXTERNO", pid: "GERENTE_GENERAL", tags: ["CONTADOR_EXTERNO"], Empleado: "Angel Quito", Cargo: "Contador General" },


    // Departamento de Contabilidad
    { id: "CONTABILIDAD", pid: "CONTADOR_EXTERNO", tags: ["CONTABILIDAD", "department"], Empleado: "Contabilidad" },
    { id: "CONTADOR_GENERAL", pid: "CONTABILIDAD", tags: ["CONTADOR_GENERAL"], Empleado: "Mariuxi Isabel Valarezo Armijos", Cargo: "Coordinador Contable", img: "/storage/fotosPerfiles/Qrch5rNuBb.jpeg" },
    { id: "AUXILIAR_CONTABLE_1", pid: "CONTADOR_GENERAL", tags: ["AUXILIAR_CONTABLE"], Empleado: "Allison Brigitte Muentes Gonzabay", Cargo: "Auxiliar Contable", img: "/storage/fotosPerfiles/HlF29ovXOA.jpeg" },
    { id: "AUXILIAR_CONTABLE_2", pid: "CONTADOR_GENERAL", tags: ["AUXILIAR_CONTABLE"], Empleado: "Solange Carolina Romero Feijoo", Cargo: "Auxiliar Contable", img: "/storage/fotosPerfiles/2ywSn3dObX.jpeg" },
    { id: "AUXILIAR_CONTABLE_3", pid: "CONTADOR_GENERAL", tags: ["AUXILIAR_CONTABLE"], Empleado: "Maiby Gineth Lapo Velez", Cargo: "Auxiliar Contable", img: "/storage/fotosPerfiles/WsJ3VGyzik.jpeg" },

    // Departamento de Recursos Humanos
    { id: "RRHH", pid: "GERENTE_GENERAL", tags: ["RRHH", "department"], Empleado: "Recursos Humanos" },
    { id: "JEFE_RRHH", pid: "RRHH", tags: ["JEFE_RRHH"], Empleado: "Nombre del Jefe de RRHH", Cargo: "Jefe RRHH", img: "URL_de_la_imagen" }, // Sustituye por el nombre y URL real
    { id: "ASISTENTE_RRHH", pid: "JEFE_RRHH", tags: ["ASISTENTE_RRHH"], Empleado: "Nombre del Asistente de RRHH", Cargo: "Asistente RRHH", img: "URL_de_la_imagen" }, // Sustituye por el nombre y URL real



    // Departamento de Informática
    { id: "INFORMATICA", pid: "GERENTE_GENERAL", tags: ["INFORMATICA", "department"], Empleado: "Informática" },
    { id: "COORDINADOR_INFORMATICA", pid: "INFORMATICA", tags: ["COORDINADOR_INFORMATICA"], Empleado: "Wilson Steven Cordova Eras", Cargo: "Coordinador de Informática", img: "/storage/fotosPerfiles/tQ08NuZawZ.jpeg" },
    { id: "TECNICO_HELP_DESK", pid: "COORDINADOR_INFORMATICA", tags: ["TECNICO_HELP_DESK"], Empleado: "Erick Antonio Cañarte Vega", Cargo: "Técnico Help Desk", img: "URL_de_la_imagen" }, // Sustituye por el nombre y URL real
    { id: "PROGRAMADOR", pid: "COORDINADOR_INFORMATICA", tags: ["PROGRAMADOR"], Empleado: "Juan Bryan Cuesta Vera", Cargo: "Programador", img: "/storage/fotosPerfiles/tGINpIuMDC.jpeg" },



    // Departamento de Seguridad, Salud y Ambiente (SSA)
    { id: "SSA", pid: "GERENTE_GENERAL", tags: ["SSA", "department"], Empleado: "Seguridad, Salud y Ambiente (SSA)" },
    { id: "JEFE_SSA", pid: "SSA", tags: ["JEFE_SSA"], Empleado: "Arnaldo Jose Serrano Coello", Cargo: "Jefe Unidad SSA", img: "/storage/fotosPerfiles/8vgsdMgg1x.jpeg" },
    { id: "TECNICO_AMBIENTAL", pid: "JEFE_SSA", tags: ["TECNICO_AMBIENTAL"], Empleado: "Brigitte Estefania Andrango Rodriguez", Cargo: "Técnico Ambiental", img: "/storage/fotosPerfiles/UPEOXzdCMg.jpeg" },
    { id: "MEDICO_OCUPACIONAL", pid: "JEFE_SSA", tags: ["MEDICO_OCUPACIONAL"], Empleado: "Jefferson Paclito Freire Torres", Cargo: "Médico Ocupacional", img: "/storage/fotosPerfiles/9QoUNExA7i.jpeg" },


    // Departamento de Servicios Generales
    { id: "SERVICIOS_GENERALES", pid: "GERENTE_GENERAL", tags: ["SERVICIOS_GENERALES", "department"], Empleado: "Servicios Generales" },
    { id: "JEFE_SERVICIOS_GENERALES", pid: "SERVICIOS_GENERALES", tags: ["JEFE_SERVICIOS_GENERALES"], Empleado: "Arnaldo Jose Serrano Coello", Cargo: "Jefe de Servicios Generales", img: "/storage/fotosPerfiles/8vgsdMgg1x.jpeg" },

    // Empleados de Servicios Generales
    { id: 43, pid: "JEFE_SERVICIOS_GENERALES", tags: ["AUXILIAR_LIMPIEZA"], Empleado: "Sally Andrea Caicedo Parra", Cargo: "Auxiliar de Limpieza", img: "/storage/fotosPerfiles/OzLlF3qUvP.png" },
    { id: 201, pid: "JEFE_SERVICIOS_GENERALES", tags: ["CHOFER"], Empleado: "Luis Eduardo Chapa Romero", Cargo: "Chofer", img: "/storage/fotosPerfiles/OePhTa4Or3.jpeg" },

    // Empleado Externo de Servicios Generales
    { id: 216, pid: "JEFE_SERVICIOS_GENERALES", tags: ["AUXILIAR_LIMPIEZA", "external"], Empleado: "Isabel Maritza Contreras Caicedo", Cargo: "Auxiliar de Limpieza (Externa)", img: "/storage/fotosPerfiles/5OjhaUEvMr.jpeg", template: "external" },


    // Departamento de Bodega
    { id: "BODEGA", pid: "GERENTE_GENERAL", tags: ["BODEGA", "department"], Empleado: "Bodega" },
    { id: "COORDINADOR_BODEGA", pid: "BODEGA", tags: ["COORDINADOR_BODEGA"], Empleado: "Eugenia Maribel Ortega Aguilar", Cargo: "Coordinador de Bodega", img: "/storage/fotosPerfiles/o2JZuWVgoV.jpeg" },
    { id: "AUXILIAR_BODEGA", pid: "COORDINADOR_BODEGA", tags: ["AUXILIAR_BODEGA"], Empleado: "Juan Jose Torres Quezada", Cargo: "Auxiliar de Bodega", img: "/storage/fotosPerfiles/a9hXrUhiy5.jpeg" },


    // Departamento Técnico
    { id: "TECNICO", pid: "GERENTE_GENERAL", tags: ["TECNICO", "department"], Empleado: "Técnico" },
    { id: "JEFE_TECNICO", pid: "TECNICO", tags: ["JEFE_TECNICO"], Empleado: "Jonnathan Adrian Veintimilla Segarra", Cargo: "Jefe Técnico", img: "/storage/fotosPerfiles/dJ69lfw1Vu.jpeg" },
    { id: "COORDINACION TELCONET", pid: "JEFE_TECNICO", tags: ["COORDINACION TELCONET"], Empleado: "Ruben Darío Loja Torres", Cargo: "Coordinador Telconet", img: "/storage/fotosPerfiles/VM71KPFrmn.jpeg" },
    { id: "COORDINACION NEDETEL", pid: "JEFE_TECNICO", tags: ["COORDINACION NEDETEL"], Empleado: "Leiver Joao Celi", Cargo: "Coordinador Nedetel", img: "/storage/fotosPerfiles/rdUDc0l3he.jpeg" },
    { id: "COORDINACION GIS", pid: "JEFE_TECNICO", tags: ["COORDINACION GIS"], Empleado: "Jonnathan Adrian Veintimilla Segarra", Cargo: "Coordinador GIS", img: "/storage/fotosPerfiles/fj7IzD20lT.jpeg" },
    { id: "JEFATURA DE PROYECTOS", pid: "JEFE_TECNICO", tags: ["JEFATURA DE PROYECTOS"], Empleado: "Jonnathan Adrian Veintimilla Segarra", Cargo: "JEFE DE PROYECTOS", img: "/storage/fotosPerfiles/fj7IzD20lT.jpeg" },


    //Coordinacion Telconet
    { "id": 46, "pid": "COORDINACION TELCONET", "tags": ["ASISTENTE_OPERACIONES"], "Empleado": "Ashley Milena Orellana Fernandez", "Cargo": "Asistente de Operaciones", "img": "/storage/fotosPerfiles/TaFtsPSQwM.jpeg" },
    { "id": 47, "pid": 46, "tags": ["LIDER_CUADRILLA"], "Empleado": "Jairo Ignacio Seguiche Castro", "Cargo": "Líder de Cuadrilla", "img": "/storage/fotosPerfiles/bx77huXx60.jpeg" },
    { "id": "TECNICO_CABLISTA_1", "pid": 47, "tags": ["TECNICO_CABLISTA"], "Empleado": "Jean Carlos Toala Pinargote", "Cargo": "Técnico Cablista" },
    { "id": "TECNICO_CABLISTA_2", "pid": 47, "tags": ["TECNICO_CABLISTA"], "Empleado": "Michael Stalyn Briones Mendoza", "Cargo": "Técnico Cablista" },
    { "id": "TECNICO_CABLISTA_3", "pid": 47, "tags": ["TECNICO_CABLISTA"], "Empleado": "Jose Jacinto Palma Choez", "Cargo": "Técnico Cablista" },
    { "id": "AYUDANTE_CABLISTA_1", "pid": 47, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Jose Gabriel Pillazagua Gonzalez", "Cargo": "Ayudante Cablista" },
    { "id": "TECNICO_CABLISTA_4", "pid": 47, "tags": ["TECNICO_CABLISTA"], "Empleado": "Victor Antonio Orobio Castro", "Cargo": "Técnico Cablista" },
    { "id": "AYUDANTE_CABLISTA_2", "pid": 47, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Walter Eduardo Zambrano Pillasagua", "Cargo": "Ayudante Cablista" },
    { "id": "AYUDANTE_CABLISTA_3", "pid": 47, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Anthony Abel Leon Gonzalez", "Cargo": "Ayudante Cablista" },
    { "id": "AYUDANTE_CABLISTA_4", "pid": 47, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Luis Carlos Seguiche Choez", "Cargo": "Ayudante Cablista" },
    { "id": "AYUDANTE_CABLISTA_5", "pid": 47, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Erick Alexis Mera Rodriguez", "Cargo": "Ayudante Cablista" },
    { "id": 38, "pid": 46, "tags": ["LIDER_CUADRILLA"], "Empleado": "Jean Carlos Parrales Cobeña", "Cargo": "Líder de Cuadrilla" },
    { "id": "TECNICO_CABLISTA_5", "pid": 38, "tags": ["TECNICO_CABLISTA"], "Empleado": "Jostin Jandry Parrales Cobeña", "Cargo": "Técnico Cablista" },
    { "id": "TECNICO_CABLISTA_6", "pid": 38, "tags": ["TECNICO_CABLISTA"], "Empleado": "Vicente Ariel Toala Pincay", "Cargo": "Técnico Cablista" },
    { "id": "TECNICO_CABLISTA_7", "pid": 38, "tags": ["TECNICO_CABLISTA"], "Empleado": "Ronald Steven Toala Pinargote", "Cargo": "Técnico Cablista" },
    { "id": "AYUDANTE_CABLISTA_6", "pid": 38, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Jairo Gabriel Rivas Alvarado", "Cargo": "Ayudante Cablista" },
    { "id": "AYUDANTE_CABLISTA_7", "pid": 38, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Edwin Teodoro Toala Santana", "Cargo": "Ayudante Cablista" },
    { "id": "AYUDANTE_CABLISTA_8", "pid": 38, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Miguel Bolivar Perez Cevallos", "Cargo": "Ayudante Cablista" },
    { "id": "TECNICO_CABLISTA_8", "pid": 38, "tags": ["TECNICO_CABLISTA"], "Empleado": "Darwin Angel Loor Pincay", "Cargo": "Técnico Cablista" },
    { "id": "AYUDANTE_CABLISTA_9", "pid": 38, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Francisco Eusebio Peñafiel Perez", "Cargo": "Ayudante Cablista" },
    { "id": "AYUDANTE_CABLISTA_10", "pid": 38, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Victor Hugo Zambrano Pivaque", "Cargo": "Ayudante Cablista" },
    { "id": "AYUDANTE_CABLISTA_11", "pid": 38, "tags": ["AYUDANTE_CABLISTA"], "Empleado": "Jose Luis Piza Alvarado", "Cargo": "Ayudante Cablista" },
    { "id": "ALBAÑIL_1", "pid": 46, "tags": ["ALBAÑIL"], "Empleado": "Ruben Dario Armijos Sanchez", "Cargo": "Albañil" },
    { "id": "AYUDANTE_OBRA_CIVIL_1", "pid": 46, "tags": ["AYUDANTE_OBRA_CIVIL"], "Empleado": "Jefferson Leonardo Laaz Loor", "Cargo": "Ayudante de Obra Civil" },
    { "id": "TECNICO_AIRE_1", "pid": 46, "tags": ["TECNICO_AIRE"], "Empleado": "Técnico de Aires", "Cargo": "Técnico de Aires" },
    { "id": "CHOFER_GRUA_1", "pid": 46, "tags": ["CHOFER_GRUA"], "Empleado": "Chofer de Grúa", "Cargo": "Chofer de Grúa" },


    //Coordinacion Nedetel
    { "id": 30, "pid": "COORDINACION NEDETEL", "tags": ["COORDINADOR_TECNICO"], "Empleado": "Nicolas Eduardo Pazmiño Barros", "Cargo": "Coordinador Técnico", "img": "/storage/fotosPerfiles/du9a4HHSDQ.jpeg" },
    { "id": 39, "pid": "COORDINACION NEDETEL", "tags": ["COORDINADOR_TECNICO"], "Empleado": "Alberto Daniel Salas Reina", "Cargo": "Coordinador Técnico", "img": "/storage/fotosPerfiles/pFjz0mhHiD.jpeg" },
    { "id": 76, "pid": "COORDINACION NEDETEL", "tags": ["COORDINADOR_STAND_BY"], "Empleado": "Miguel Angel Palma Macias", "Cargo": "Coordinador Stand By", "img": "/storage/fotosPerfiles/OrWQxnD17w.jpeg" },
    { "id": 226, "pid": "COORDINACION NEDETEL", "tags": ["COORDINADOR_TECNICO"], "Empleado": "Kelvin Francisco Menendez Cedeño", "Cargo": "Coordinador Técnico", "img": "/storage/fotosPerfiles/K6G0zJtgBy.jpeg" },
    { "id": 415, "pid": "COORDINACION NEDETEL", "tags": ["COORDINADOR_STAND_BY"], "Empleado": "Carlos Eduardo Izquierdo Ganchoso", "Cargo": "Coordinador Stand By", "img": "/storage/fotosPerfiles/Cu3VeP47jf.jpeg" },

    { "id": 61, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Angel Geovanny Chamba Enriquez", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/pWtAtBVuPG.jpeg" },
    { "id": 71, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Wilmer Fabian Lema Chulli", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/axYQhzDoVQ.jpeg" },
    { "id": 90, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Agustin Patricio Zambrano Guzman", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/QoWP7rBJv0.jpeg" },
    { "id": 121, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Juan Heriberto Vargas Angüisaca", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/uS8uHtTkGF.jpeg" },
    { "id": 128, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Oscar Eduardo Mora Cevallos", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/r9KFvmR1P3.jpeg" },
    { "id": 138, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Luis Gabriel Gonzales Merelo", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/ys1di2qBDm.jpeg" },
    { "id": 153, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Diego German Moran Jimenez", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/qCkjUoPbfn.jpeg" },
    { "id": 361, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Denilson Bladimir Mocha Vacacela", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/if4aKMFSqv.jpeg" },
    { "id": 403, "pid": 226, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Josue Andres Quinte Granda", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/d4x7vCPQhO.jpeg" },

    { "id": 31, "pid": 30, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Patricio Rodrigo Mendez", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/VM71KPFrmn.jpeg" },
    { "id": 37, "pid": 30, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Diego Hernan Iñamagua Lala", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/G8izQveP0x.jpeg" },
    { "id": 48, "pid": 30, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Jonnathan Adrian Panchi Diaz", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/zagBt5rcUQ.png" },
    { "id": 51, "pid": 30, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Jimmy Javier Macas Chuchuca", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/dFOt5cEwnY.png" },
    { "id": 53, "pid": 30, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Jefferson Rafael Abad Zumba", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/gYBSlT9ncK.png" },
    { "id": 126, "pid": 30, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Bryan Jose Guerrero Prado", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/LVeahleBkX.jpeg" },
    { "id": 133, "pid": 30, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Christian Xavier Sangurima Tenepaguay", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/DyWcIx7HYc.jpeg" },

    { "id": 54, "pid": 39, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Jonathan Francisco Aguilar Alcivar", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/xr0j9ZJTgg.png" },
    { "id": 88, "pid": 39, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Alexander Leonel Toapanta Arroyo", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/0zj0mqzZTP.jpeg" },
    { "id": 163, "pid": 39, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Patricio Gabriel Villamarin Imbaquingo", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/a7771WybUu.jpeg" },
    { "id": 223, "pid": 39, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Jose Luis Cedeño Macias", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/8DPokLUZYt.jpeg" },
    { "id": 358, "pid": 39, "tags": ["TECNICO_LIDER_GRUPO"], "Empleado": "Jeferson Alfredo Vera Cadena", "Cargo": "Técnico Líder de Grupo", "img": "/storage/fotosPerfiles/fStzgm0TO9.jpeg" },

    //Coordinacion GIS
    { "id": 33, "pid": "COORDINACION GIS", "tags": ["DIBUJANTE GIS"], "Empleado": "Joselyn Ariana Ramos Hidalgo", "Cargo": "Dibujante", "img": "/storage/fotosPerfiles/ZkYIo1iSC4.jpeg" },


    // Jefatura de Proyectos
    { "id": "SUPERVISOR_DE_CAMPO_1", "pid": "JEFATURA DE PROYECTOS", "tags": ["SUPERVISOR_DE_CAMPO"], "Empleado": "Kevin Fernando Camacho Garcia", "Cargo": "Supervisor de Campo", "img": "/storage/fotosPerfiles/WSZNJxUcic.png" },
    { "id": "SUPERVISOR_DE_CAMPO_2", "pid": "JEFATURA DE PROYECTOS", "tags": ["SUPERVISOR_DE_CAMPO"], "Empleado": "Kelvin Francisco Menendez Cedeño", "Cargo": "Supervisor de Campo", "img": "/storage/fotosPerfiles/K6G0zJtgBy.jpeg" },


    //DEPARTAMENTO DE VENTAS
    { "id": "VENTAS", "pid": "GERENTE_GENERAL", "tags": ["VENTAS", "department"], "Empleado": "Comercial" },
    { "id": "COORDINADOR_VENTAS", "pid": "VENTAS", "tags": ["COORDINADOR_VENTAS"], "Empleado": "Coordinador de Ventas" },
    { "id": "SUPERVISOR_VENTAS_1", "pid": "COORDINADOR_VENTAS", "tags": ["SUPERVISOR_VENTAS"], "Empleado": "Sandra Del Rocio Arizaga Tandazo", "Cargo": "Supervisora de Ventas", "img": "" }, // No tiene imagen
    { "id": "SUPERVISOR_VENTAS_2", "pid": "COORDINADOR_VENTAS", "tags": ["SUPERVISOR_VENTAS"], "Empleado": "Raul Ignacio Vera Astudillo", "Cargo": "Supervisor de Ventas", "img": "" }, // No tiene imagen
    { "id": "SUPERVISOR_VENTAS_3", "pid": "COORDINADOR_VENTAS", "tags": ["SUPERVISOR_VENTAS"], "Empleado": "Claudia Stefania Loor Delgado", "Cargo": "Supervisora de Ventas", "img": "/storage/fotosPerfiles/pmIofLxdNN.jpeg" },


    //Vendedores | Cuenca

    { "id": "VENDEDOR_1", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Galo Bernardo Abril Idrovo", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_2", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Diego Armando Santander Velez", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_3", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Adrian Steven Gomez Pumayugra", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_4", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Henry Adan Flores Duran", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_5", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Juan Carlos Escandon Loja", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_6", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Diego Patricio Duran Calle", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_7", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Dario Javier Pesantez Romero", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_8", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Carlos Daniel Perez Orellana", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_9", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Henry Sebastian Minchala Calle", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_10", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Karla Elizabeth Ramirez Granda", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_11", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Nicholas Guerra Macias", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_12", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Alexis Mateo Heredia Quizhpi", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_13", "pid": "SUPERVISOR_VENTAS_1", "tags": ["VENDEDOR"], "Empleado": "Danny Fernando Flores Heredia", "Cargo": "Vendedor" },

    //Vendedores | Guayaquil

    { "id": "VENDEDOR_14", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Wilson Andres Aquino Calderon", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_15", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Jhon Estarqui Farias Cervantes", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_16", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Glenda Mariana Macias Alfonso", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_17", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Jorge Enrique Villalva Mosquera", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_18", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Axel Santiago Ojeda Mora", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_19", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Walter Stalin Perez Castrillon", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_20", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Miguel Angel Ortiz Caceres", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_21", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Roberto David Sanchez Rivera", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_22", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Christian Fernando Vasquez Beltran", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_23", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Catalina Vanessa Mina Plata", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_24", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Arisa Milena Garzon Yagual", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_25", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Noely Katherine Peña Mina", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_26", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Alberto Isaac Lindao Bararata", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_27", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Sandra Maria Panezo Panezo", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_28", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Jorge Alberto Collaguazo Reyes", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_29", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Jessica Maria Saa Rodriguez", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_30", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Martha Priscilla Alvarez Paye", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_31", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Roberth Alexander Briones Perez", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_32", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Jefferson Alexis Tubay Pincay", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_33", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Cesar Xavier Torres Bohorquez", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_34", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Jina Maria Pita Vergara", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_35", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Ana Maria Fuentes Briones", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_36", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Tania Janeth Toala Villarroel", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_37", "pid": "SUPERVISOR_VENTAS_2", "tags": ["VENDEDOR"], "Empleado": "Diana Elizabeth Alvarado Reyes", "Cargo": "Vendedor" },

    //Vendedores | Machala
    { "id": "VENDEDOR_38", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Guido Oteiza Benavides", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_39", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Juan Carlos Delgado Guasumba", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_40", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Luis Fernando Asqui Placencia", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_41", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Sandra Elizabeth Rambay Solorzano", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_42", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Hanmito Antonio Quevedo Loaiza", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_43", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Miriam Mariuxi Cardenas Sanmartin", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_44", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Joseph David Barreiro Lucin", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_45", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Lady Marcela Tenezaca Romero", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_46", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Maria Fernanda Pacheco Sanchez", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_47", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Joselyn Michelle Soriano Tebante", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_48", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Yeimy Veronica Gracia Miranda", "Cargo": "Vendedor" },
    { "id": "VENDEDOR_49", "pid": "SUPERVISOR_VENTAS_3", "tags": ["VENDEDOR"], "Empleado": "Ines Maria Barahona Chango", "Cargo": "Vendedor" }


    // Otros departamentos y cargos

  ]);


});


// ... otras funciones

function getOptions() {
  const searchParams = new URLSearchParams(window.location.search);
  let fit = searchParams.get('fit');
  let enableSearch = true;
  let scaleInitial = 1;
  if (fit == 'yes') {
    enableSearch = false;
    scaleInitial = OrgChart.match.boundary;
  }
  return { enableSearch, scaleInitial };
}
</script>


<style scoped>
/* Configuración global */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: Helvetica, Arial, sans-serif;
  /* Incluye Arial como alternativa */
  overflow: hidden;
  /* Evita scroll innecesario */
}

#tree {
  width: 100%;
  height: 100%;
}

/* Estilos específicos de los nodos del organigrama */

/* Estilo para el equipo de Recursos Humanos */
[lcn='hr-team']>rect {
  fill: #FFCA28;
  /* Fondo de los nodos HR */
}

.hr-team>rect {
  fill: #fff5d8;
  /* Fondo más claro para los nodos HR */
}

.hr-team>text {
  fill: #ecaf00;
  /* Color del texto HR */
}

.hr-team [data-ctrl-n-menu-id] line {
  stroke: #ecaf00;
  /* Color de las líneas del menú HR */
}

.hr-team>g>.ripple {
  fill: #ecaf00;
  /* Color del efecto de onda HR */
}

/* Estilo para el equipo de ventas */
[lcn='sales-team']>rect {
  fill: #F57C00;
  /* Fondo de los nodos de ventas */
}

.sales-team>rect {
  fill: #ffeedd;
  /* Fondo más claro para los nodos de ventas */
}

.sales-team>text {
  fill: #F57C00;
  /* Color del texto de ventas */
}

.sales-team [data-ctrl-n-menu-id] line {
  stroke: #F57C00;
  /* Color de las líneas del menú de ventas */
}

.sales-team>g>.ripple {
  fill: #F57C00;
  /* Color del efecto de onda de ventas */
}

/* Estilo para la gerencia */
[lcn='GERENCIA']>rect {
  fill: #f2f2f2;
  /* Fondo de los nodos de gerencia */
}

[lcn='GERENCIA']>text,
.assistant>text {
  fill: #aeaeae;
  /* Color del texto de gerencia y asistentes */
}

[lcn='GERENCIA'] circle,
[lcn='assistant'] {
  fill: #aeaeae;
  /* Color de los círculos de gerencia y asistentes */
}

.assistant>rect {
  fill: #ffffff;
  /* Fondo blanco para los asistentes */
}

.assistant [data-ctrl-n-menu-id]>circle {
  fill: #aeaeae;
  /* Color del círculo del menú de los asistentes */
}

/* Estilo para el equipo de TI */
.it-team>rect {
  fill: #b4ffff;
  /* Fondo de los nodos de TI */
}

.it-team>text {
  fill: #039BE5;
  /* Color del texto de TI */
}

.it-team [data-ctrl-n-menu-id] line {
  stroke: #039BE5;
  /* Color de las líneas del menú de TI */
}

.it-team>g>.ripple {
  fill: #00efef;
  /* Color del efecto de onda de TI */
}
</style>
