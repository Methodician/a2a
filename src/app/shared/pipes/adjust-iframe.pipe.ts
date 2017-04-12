import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adjustIframe'
})
export class AdjustIframePipe implements PipeTransform {

  transform(iframeHTML) {

    return iframeHTML.replace('width="560" height="315"', 'width="100%" height="100%"');
  }

}
