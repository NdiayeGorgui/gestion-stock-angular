import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(private translate: TranslateService) {
    const storedLang = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();
    const langToUse = storedLang || (browserLang?.match(/en|fr/) ? browserLang : 'en');

    this.translate.setDefaultLang('en');
    this.translate.use(langToUse);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
