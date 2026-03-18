import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'theory', loadComponent: () => import('./theory/theory').then(m => m.TheoryComponent) },
    {
        path: 'routing',
        loadComponent: () => import('./routing-theory/routing-theory').then(m => m.RoutingTheoryComponent),
        children: [
            {
                path: 'details',
                loadComponent: () => import('./routing-theory/routing-child').then(m => m.RoutingChildComponent)
            },
            {
                path: 'details/:id',
                loadComponent: () => import('./routing-theory/routing-child').then(m => m.RoutingChildComponent)
            }
        ]
    },
    { path: 'products', loadComponent: () => import('./products/products').then(m => m.ProductsComponent) },
    { path: 'products/:id', loadComponent: () => import('./products/product-details').then(m => m.ProductDetailsComponent) },
    { path: 'users', loadComponent: () => import('./users/users').then(m => m.UsersComponent) },
    { path: '', redirectTo: 'theory', pathMatch: 'full' }
];
