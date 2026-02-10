import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserSession } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentUser: UserSession | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = { ...this.profileForm.value };
    // Ne pas envoyer le mot de passe s'il est vide
    if (!updateData.password) {
      delete updateData.password;
    }

    this.authService.updateUser(updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Profil mis à jour avec succès';
        // Effacer le mot de passe du formulaire
        this.profileForm.get('password')?.reset();
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  deleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte définitivement ? Cette action est irréversible.')) {
      this.isLoading = true;
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/auth/register']);
        },
        error: (error) => {
          this.errorMessage = error;
          this.isLoading = false;
        }
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
