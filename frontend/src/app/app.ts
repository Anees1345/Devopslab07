import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PredictionService } from './core/services/prediction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private api = inject(PredictionService);

  readonly isStatic = this.api.isStaticDeployment();
  mobileMenuOpen = false;
  backendOnline = false;

  ngOnInit(): void {
    if (!this.isStatic) {
      this.api.checkHealth().subscribe({
        next: (res) => {
          this.backendOnline = res.status === 'ok';
        },
        error: () => {
          this.backendOnline = false;
        }
      });
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
