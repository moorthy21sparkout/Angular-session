import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  async ngOnInit() {
    // CRITICAL: We only fetch data if we are in the browser
    // This forces CSR behavior for this component demo
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Adding a slight delay to make the loading state visible for freshers
        await new Promise(resolve => setTimeout(resolve, 1500));

        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await res.json();
        this.users.set(data);
      } catch (error) {
        console.error('CSR Load failed', error);
      } finally {
        this.loading.set(false);
      }
    } else {
      // On the server, we do nothing. The server will render the "Loading..." state.
      console.log('Server-side skipping user fetch for CSR demo');
    }
  }
}
