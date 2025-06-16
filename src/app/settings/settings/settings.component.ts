import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  darkTheme: boolean = false;
  notificationsEnabled: boolean = true;
  selectedLanguage: string = 'en';
  fontSize: string = 'medium';

  languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];

  fontSizes = ['small', 'medium', 'large'];


constructor(private translate: TranslateService) {
  this.selectedLanguage = localStorage.getItem('lang') || 'en';
}



  ngOnInit(): void {
    const storedTheme = localStorage.getItem('darkTheme');
    const storedFontSize = localStorage.getItem('fontSize');
    const storedLang = localStorage.getItem('lang');

    this.darkTheme = storedTheme === 'true';
    this.fontSize = storedFontSize || 'medium';
    this.selectedLanguage = storedLang || 'en';
    this.darkTheme = storedTheme === 'true';
    this.applyTheme();
    this.applyFontSize();
    this.applyLanguage();
  }

  applyLanguage(): void {
  localStorage.setItem('lang', this.selectedLanguage);
  this.translate.use(this.selectedLanguage);
}


  toggleTheme(): void {
  this.darkTheme = !this.darkTheme;
  localStorage.setItem('darkTheme', this.darkTheme.toString());
  this.applyTheme();
}

applyTheme(): void {
  const classList = document.body.classList;
  if (this.darkTheme) {
    classList.add('dark-theme');
    classList.remove('light-theme');
  } else {
    classList.add('light-theme');
    classList.remove('dark-theme');
  }
}

applyFontSize(): void {
  const sizeMap = {
    small: '14px',
    medium: '16px',
    large: '20px'
  };

  const sizeKey = this.fontSize as keyof typeof sizeMap;
  document.documentElement.style.setProperty('--font-size', sizeMap[sizeKey]);
  localStorage.setItem('fontSize', this.fontSize);
}




changeLanguage() {
  this.translate.use(this.selectedLanguage);
  localStorage.setItem('lang', this.selectedLanguage);
}


reset(): void {
  this.darkTheme = false;
  this.notificationsEnabled = true;
  this.fontSize = 'medium';
  this.selectedLanguage = 'en';

  localStorage.clear();

  this.applyTheme();
  this.applyFontSize();

  // Appliquer la langue après le reset
  this.translate.use(this.selectedLanguage);
}


  
}