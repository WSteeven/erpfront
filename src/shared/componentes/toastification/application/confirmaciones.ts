import Swal from "sweetalert2"

export function useConfirmaciones(): any {
  const confirmarAccion = (
    mensaje: string,
    okLabel = "Continuar",
    cancelLabel = "Cancelar",
    callback: () => void
  ) => {
    Swal.fire({
      title: "Advertencia",
      text: mensaje,
      // icon: "warning",
      iconColor: "#6574cd",
      showCancelButton: true,
      confirmButtonColor: "#6574cd",
      cancelButtonColor: "#ab296a",
      confirmButtonText: okLabel,
      cancelButtonText: cancelLabel,
      showClass: {
        popup: "fadeInDown",
      },
      hideClass: {
        popup: "fadeOutUp",
      },
      backdrop: "rgba(21, 28, 38, 0.4)",
    }).then((result) => {
      if (result.isConfirmed) {
        callback()
      }
    })
  }
  return {
    confirmarAccion,
  }
}
