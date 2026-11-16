/* Logan Meier | November 15, 2026 | JS Project: Form validation */
const form = document.querySelector('[data-validate]');

if (form) {
    const fields = [...form.querySelectorAll('input, select, textarea')];
    const status = document.getElementById('form-status');
    let attempted = false;

    // Use the visitor's local date
    function today() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${now.getFullYear()}-${month}-${day}`;
    }
    form.elements.date.max = today();

    // Make a place for each error message
    fields.forEach(field => {
        const error = document.createElement('p');
        error.id = `${field.id}-error`;
        error.className = 'field-error';
        error.hidden = true;
        field.after(error);
        field.setAttribute('aria-describedby', error.id);
    });

    function validate(field) {
        const value = field.value.trim();
        let message = '';

        // Reject blank fields, including spaces
        if (field.required && !value) {
            message = 'Please complete this field.';
        } else if (field.name === 'email' && value &&
                   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            message = 'Enter an email like name@example.com.';
        } else if (field.name === 'date' && value > today()) {
            message = 'The date cannot be in the future.';
        } else if (field.name === 'photo' && field.files.length) {
            const photo = field.files[0];
            const types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!types.includes(photo.type)) {
                message = 'Choose a JPG, PNG, WebP, or GIF image.';
            } else if (photo.size > 5 * 1024 * 1024) {
                message = 'Choose an image that is 5 MB or smaller.';
            }
        }

        // Show the error beside its field
        const error = document.getElementById(`${field.id}-error`);
        error.textContent = message;
        error.hidden = !message;
        field.setAttribute('aria-invalid', String(Boolean(message)));
        return message === '';
    }

    form.addEventListener('submit', event => {
        // Keep this demo from sending data or reloading
        event.preventDefault();
        attempted = true;
        let firstInvalid = null;
        fields.forEach(field => {
            if (!validate(field) && !firstInvalid) firstInvalid = field;
        });
        status.hidden = false;
        if (firstInvalid) {
            status.className = 'form-status is-error';
            status.textContent = 'Please fix the marked fields and submit again.';
            firstInvalid.focus();
        } else {
            status.className = 'form-status is-success';
            status.textContent = 'Your entry passed validation. This demo does not save or send it.';
        }
    });

    // Check corrections after the first submit attempt
    fields.forEach(field => {
        const check = () => {
            status.hidden = true;
            if (attempted) validate(field);
        };
        field.addEventListener('input', check);
        field.addEventListener('change', check);
    });

    // Enable custom messages only after JavaScript is ready
    form.noValidate = true;
}
