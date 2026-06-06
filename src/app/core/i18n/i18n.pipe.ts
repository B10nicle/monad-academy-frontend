import { inject, Pipe, PipeTransform } from '@angular/core';

import { I18nService } from './i18n.service';
import { TranslationKey } from './translations';

@Pipe({
  name: 't',
  standalone: true,
  pure: false,
})
export class I18nPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: TranslationKey | string, params: Record<string, string | number> = {}): string {
    return this.i18n.translate(key, params);
  }
}
