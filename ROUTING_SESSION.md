# Angular Routing: Comprehensive Guide

## 1. Introduction to Angular Routing

### What is Routing?
Routing is the mechanism that allows a web application to navigate between different views or components without reloading the entire page. In a traditional multi-page application, every link navigates to a new URL, and the browser fetches a fresh HTML document. In Angular, we use **Client-Side Routing**.

### Single Page Applications (SPA)
Angular is designed for building SPAs. In an SPA:
- Only one HTML page is loaded (usually `index.html`).
- Navigation happens by swapping components in and out of a specific area in the DOM.
- This results in a much faster and smoother "app-like" user experience.

---

## 2. Setting Up Routing

### Route Configuration
Routes are defined as an array of objects. Each object typically has a `path` and a `component` (or `loadComponent` for lazy loading).

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default redirect
  { path: '**', component: NotFoundComponent }       // Wildcard (404)
];
```

### Providing the Router
In modern Angular (Standalone), we providing routing in `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
```

---

## 3. Router Basics

### 3.1 The Router Outlet Secret: Static vs Dynamic

One of the most important concepts to understand is how `<router-outlet>` differs from a traditional child component.

#### comparison: Static Children vs. Routed Views

| Feature | Static Child (`<app-child>`) | Routed View (`<router-outlet>`) |
| :--- | :--- | :--- |
| **Declaration** | Hard-coded in template | Dynamic injection point |
| **Relationship** | Fixed Parent-Child | Decoupled and flexible |
| **Presence** | Always present | Only loaded when route matches |
| **DOM Position** | Nested child | Technically a sibling to surrounding elements |

#### Visual Relationship

```mermaid
graph TD
    subgraph "Traditional Static Child"
        P1["Parent Component"] --> C1["&lt;app-child&gt;"]
    end

    subgraph "Dynamic Routed View"
        RE["Router Engine"] -- "Injects Component" --> RO["&lt;router-outlet&gt;"]
    end
```

> [!IMPORTANT]
> **Key Insight:** The Router Outlet is just a **placeholder**, not a container.
> It doesn't wrap the new page. It just tells Angular: *"Put the new page right here, next to me."*
> Therefore, the new page and the outlet are **siblings**, not parent and child!

#### Practical Example
If you have a navbar and a footer in `app.component.html`, the routed component will sit **between** them.

```html
<!-- app.component.html -->
<app-navbar></app-navbar>

<main>
  <!-- The Router Engine "swaps" components here -->
  <router-outlet></router-outlet> 
</main>

<app-footer></app-footer>
```

### RouterLink (Declarative Navigation)
Used in templates to navigate between routes. It's better than `href` because it prevents page reloads.

```html
<a routerLink="/home" routerLinkActive="active">Home</a>
<a [routerLink]="['/products', 101]">Product 101</a>
```

### Router Service (Imperative Navigation)
Used in TypeScript to navigate programmatically.

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigateToHome() {
  this.router.navigate(['/home']);
}
```

---

## 4. Passing Data Between Routes

### Route Parameters
For fixed ID-based navigation (e.g., `/products/101`).

- **Configuration**: `{ path: 'products/:id', component: ProductComponent }`
- **Sending**: `this.router.navigate(['/products', 101])`
- **Receiving**: `this.route.snapshot.paramMap.get('id')` OR `this.route.params.subscribe(...)`

### Query Parameters
For optional metadata (e.g., `/products?filter=blue`).

- **Sending**: `this.router.navigate(['/products'], { queryParams: { filter: 'blue' } })`
- **Receiving**: `this.route.queryParams.subscribe(...)`

### `snapshot` vs `subscribe`
When retrieving route parameters or query parameters, you have two options:
- **`snapshot` (The Shortcut)**: Read the value *once* when the component is created. Best for simple cases where the route data never changes while the component is alive. 
  Example: `this.route.snapshot.paramMap.get('id')`
- **`subscribe` (The Observable)**: Listen for changes continuously. Angular *reuses* component instances if you navigate to the same component but with different parameters (e.g., from `/user/1` to `/user/2`), to save resources. When this happens, `ngOnInit` does *not* run again. A `snapshot` would keep the old ID (`1`), but a `subscribe` will emit the new ID (`2`), allowing you to update the view without a full page reload.

> [!CAUTION]
> Always use `subscribe` if your component has links that route to itself with different parameters!

### Navigation State
For passing complex objects without showing them in the URL.

- **Sending**: `this.router.navigate(['/details'], { state: { user: someUserObj } })`
- **Receiving**: `this.router.getCurrentNavigation()?.extras.state` (Constructor only!)

---

## 5. Advanced Routing Concepts

### Child Routes (Nested Routing)
Allows you to have sub-views within a parent component.

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    { path: 'stats', component: StatsComponent },
    { path: 'profile', component: ProfileComponent }
  ]
}
```

### Lazy Loading
Loads feature modules or components only when the user navigates to them, reducing initial bundle size.

```typescript
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
}
```

### Route Guards
Intercept navigation to check for permissions (e.g., Authentication).

- `CanActivate`: Can the user enter this route?
- `CanDeactivate`: Can the user leave this route?

---

## 6. Special Topics

### Comparisons: `navigate` vs `navigateByUrl`

| Feature | `router.navigate()` | `router.navigateByUrl()` |
| :--- | :--- | :--- |
| **Input** | Array of segments: `['/users', 10]` | Absolute string: `'/users/10'` |
| **Context** | Support relative navigation | Always absolute (from root) |
| **Complexity** | Good for dynamic segments | Simpler for static URLs |

### Relative Routing
Using `relativeTo` to navigate based on the current active route.

```typescript
this.router.navigate(['details'], { relativeTo: this.route });
```

---

## 7. Router Utilities & Configuration

### 7.1 RouterModule (The Foundation)

`RouterModule` is the core module that provides the necessary directives and providers for routing to work in an Angular application.

#### How to Declare
In a traditional **Module-based** application, you import it in your `AppModule`:

```typescript
@NgModule({
  imports: [
    RouterModule.forRoot(routes) // Use forRoot for the main routes
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

In a **Standalone-based** application (modern Angular), we use `provideRouter`:

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

### 7.2 RouterOutlet (The Placeholder)

The `<router-outlet>` is a directive that acts as a placeholder that Angular dynamically fills based on the current router state.

#### How it Works
1. When you navigate to a URL, the **Router Engine** searches the configuration for a matching path.
2. Once found, it identifies the associated **Component**.
3. It then "injects" that component into the nearest `<router-outlet>`.

#### Usage
Simply place it in your template where you want the routed components to appear.

```html
<nav>...</nav>
<main>
  <router-outlet></router-outlet> <!-- Dynamic Content Here -->
</main>
<footer>...</footer>
```

> [!TIP]
> You can have multiple outlets by using **Named Outlets** (e.g., `<router-outlet name="sidebar"></router-outlet>`), allowing for complex dashboard layouts.
