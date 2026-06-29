import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Registro } from './modules/traslado/pages/registro/registro';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    Registro
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Formulario de Traslado Ambulancias 247');
  protected readonly isAuthenticated = signal(false);
  protected username = '';
  protected password = '';
  protected loginError = '';
  protected readonly loginUser = environment.loginUser;
  protected readonly loginPassword = environment.loginPassword;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isAuthenticated.set(window.localStorage.getItem('ambulancia-authenticated') === 'true');
    }
  }

  protected login(): void {
    this.loginError = '';

    if (this.username.trim() === environment.loginUser && this.password.trim() === environment.loginPassword) {
      this.isAuthenticated.set(true);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('ambulancia-authenticated', 'true');
      }
      return;
    }

    this.loginError = 'Credenciales inválidas. Usa el usuario y contraseña por defecto.';
    this.password = '';
  }

  protected logout(): void {
    this.isAuthenticated.set(false);
    this.username = '';
    this.password = '';
    this.loginError = '';

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('ambulancia-authenticated');
    }
  }
}
