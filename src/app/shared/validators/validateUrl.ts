import { FormControl } from '@angular/forms';

export function validateUrl(ctrl: FormControl) {

    const urlValue = ctrl.value;

    //  I should probably learn more about regular expressions
    const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(urlValue);

    return valid ? null : {
        validUrl: {
            valid: false
        }
    }
}