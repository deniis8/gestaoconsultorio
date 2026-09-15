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

export const confirmarComOpcoes = async (
    options: SweetAlertOptions
): Promise<'confirm' | 'deny' | 'cancel'> => {
    const resultado = await Swal.fire({
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options,
    });

    if (resultado.isConfirmed) return 'confirm';
    if (resultado.isDenied) return 'deny';
    return 'cancel';
};