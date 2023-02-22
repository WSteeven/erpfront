import Pusher from "pusher-js"
import { Ref } from "vue"

export class PedidoPageEvent{
  accion: (param:string)=> void
  puedeEjecutar: Ref<boolean>

  constructor(accion:(param:string)=>void, puedeEjecutar:Ref<boolean>){
    this.accion = accion
    this.puedeEjecutar = puedeEjecutar
  }

  start(){
    const pusher = new Pusher('0df833686e4616dd7444',{
      cluster:'sa1',
    })

    const accion = this.accion
    const puedeEjecutar = this.puedeEjecutar

    pusher.subscribe('pedidos-tracker')
    pusher.bind('pedido-event', function(e){
      if(puedeEjecutar.value) {
        //hagase algo
        console.log(e)
      }
    })
  }

}

