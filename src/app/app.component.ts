import { Component } from '@angular/core';
import { LanguageService } from './services/LanguageService';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
   //constructor(private languageService: LanguageService) {}
  title = 'stock-web-app';

 constructor(private translate: TranslateService) {
  const storedLang = localStorage.getItem('lang');
  const browserLang = translate.getBrowserLang();
  const langToUse = storedLang || (browserLang?.match(/en|fr/) ? browserLang : 'en');

  translate.setDefaultLang('en');
  translate.use(langToUse);
}


}
