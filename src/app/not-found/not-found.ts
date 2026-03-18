import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div style="text-align: center; padding: 50px;">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <a routerLink="/">Go Back Home</a>
    </div>
  `
})
export class PageNotFoundComponent { }
