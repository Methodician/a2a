import { FormControl } from '@angular/forms';

export function validateUrl(ctrl: FormControl) {

    const urlValue = ctrl.value;
    const touched = ctrl.touched;

    //  I should probably learn more about regular expressions
    const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(urlValue) || !touched;

    return valid ? null : {
        validUrl: {
            valid: false
        }
    }
}