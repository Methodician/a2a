import { FormControl } from '@angular/forms';

export function validatePhone(ctrl: FormControl) {

    const phoneValue = ctrl.value;

    const valid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phoneValue);

    return valid ? null : {
        validPhone: {
            valid: false
        }
    }
}
