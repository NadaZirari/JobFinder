import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-slate-900 text-slate-400 py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 text-white mb-4">
              <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span class="text-lg font-bold">JobFinder</span>
            </div>
            <p class="max-w-xs text-sm leading-relaxed">
              Votre portail universel pour trouver les meilleures opportunités professionnelles à travers le monde.
            </p>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Navigation</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-indigo-400 transition-colors">Offres d'emploi</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition-colors">Entreprises</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Légal</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-indigo-400 transition-colors">Confidentialité</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" class="hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-xs">&copy; 2026 JobFinder. Tous droits réservés.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
             <span class="text-xs italic">Powered by JSON Server & Angular</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
