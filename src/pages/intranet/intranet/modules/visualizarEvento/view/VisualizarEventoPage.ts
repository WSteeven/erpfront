import { Evento } from "pages/intranet/eventos/domain/Evento"
import { defineComponent, ref, Ref, reactive } from 'vue'

export default defineComponent({
  components: {},
  setup() {
    const eventos: Ref<{
        id: number
        titulo: string
        tipo_evento: string
        imagen: string
        fecha_hora_inicio: string
        fecha_hora_fin: string
        descripcion: string
      }[]
    > = ref([
      {
        id: 1,
        titulo: 'Evento1',
        tipo_evento: 'cumpleaños',
        imagen:'https://cdn.quasar.dev/img/mountains.jpg',
        fecha_hora_inicio: '2024-06-08 10:00',
        fecha_hora_fin: '2024-06-16 10:00',
        descripcion:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nisi lectus, congue elementum elementum eget, egestas vitae arcu. Sed mollis consequat magna eget ultricies. Curabitur rhoncus, risus sit amet egestas consequat, tellus mi gravida lectus, ac ornare nisl dolor sed purus. Proin mollis ultrices pretium. Nullam nibh magna, sodales nec metus ac, porttitor tincidunt mauris. Quisque elementum vulputate lorem at lobortis. In suscipit egestas libero, nec interdum felis ornare in.',
      },
      {
        id: 2,
        titulo: 'Evento2',
        imagen:'https://cdn.quasar.dev/img/parallax1.jpg',
        tipo_evento: 'conferencia',
        fecha_hora_inicio: '2024-06-08 08:30',
        fecha_hora_fin: '2024-06-10 08:00',
        descripcion:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nisi lectus, congue elementum elementum eget, egestas vitae arcu. Sed mollis consequat magna eget ultricies. Curabitur rhoncus, risus sit amet egestas consequat, tellus mi gravida lectus, ac ornare nisl dolor sed purus. Proin mollis ultrices pretium. Nullam nibh magna, sodales nec metus ac, porttitor tincidunt mauris. Quisque elementum vulputate lorem at lobortis. In suscipit egestas libero, nec interdum felis ornare in.',
      },
      {
        id: 3,
        titulo: 'Evento3',
        imagen:'https://cdn.quasar.dev/img/parallax2.jpg',
        tipo_evento: 'otros',
        fecha_hora_inicio: '2024-06-08 08:00',
        fecha_hora_fin: '2024-06-10 08:30',
        descripcion:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nisi lectus, congue elementum elementum eget, egestas vitae arcu. Sed mollis consequat magna eget ultricies. Curabitur rhoncus, risus sit amet egestas consequat, tellus mi gravida lectus, ac ornare nisl dolor sed purus. Proin mollis ultrices pretium. Nullam nibh magna, sodales nec metus ac, porttitor tincidunt mauris. Quisque elementum vulputate lorem at lobortis. In suscipit egestas libero, nec interdum felis ornare in.',
      },
    ])
   /* const eventos: Ref<{
      id: number
      titulo: string
      tipo_evento: string
      imagen: string
      fecha_hora_inicio: string
      fecha_hora_fin: string
      descripcion: string
    }[]
  > = ref([
    {
      id: 1,
      titulo: 'Evento1',
      tipo_evento: 'cumpleaños',
      imagen:'https://cdn.quasar.dev/img/mountains.jpg',
      fecha_hora_inicio: '2024-05-08 10:00',
      fecha_hora_fin: '2024-05-10 10:00',
      descripcion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nisi lectus, congue elementum elementum eget, egestas vitae arcu. Sed mollis consequat magna eget ultricies. Curabitur rhoncus, risus sit amet egestas consequat, tellus mi gravida lectus, ac ornare nisl dolor sed purus. Proin mollis ultrices pretium. Nullam nibh magna, sodales nec metus ac, porttitor tincidunt mauris. Quisque elementum vulputate lorem at lobortis. In suscipit egestas libero, nec interdum felis ornare in.',
    },
   ]);*/
    return {
      eventos,
    }
  },
})
