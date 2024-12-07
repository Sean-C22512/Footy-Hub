/**
 * Display a toast notification
 * @param {string} message - The message to display in the toast
 * @param {string} type - The type of toast (e.g., 'success', 'danger', 'info', 'warning')
 */
export const showToast = (message, type = 'info') => {
    console.log('Toast called with message:', message, 'and type:', type);
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found.');
        return;
    }

    const toastId = `toast-${Date.now()}`;
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
    toast.role = 'alert';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toast);

    // Use Bootstrap's toast functionality if available
    if (window.bootstrap) {
        const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
        bsToast.show();
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
    } else {
        // Fallback for non-Bootstrap environments
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
};
