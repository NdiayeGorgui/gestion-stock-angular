import { Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  standalone: false,
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.css'
})
export class ForbiddenComponent {

    isLoading = true;

  ngOnInit(): void {
    // Simuler un chargement (1s par exemple)
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
