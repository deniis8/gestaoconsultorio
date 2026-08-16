import Swal, { SweetAlertOptions } from 'sweetalert2';

export const confirmar = async (
    options: SweetAlertOptions
): Promise<boolean> => {
    const resultado = await Swal.fire({
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options,
    });

    return resultado.isConfirmed;
};