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
    { path: 'modern-routing', loadComponent: () => import('./routing-theory/modern-routing').then(m => m.ModernRoutingComponent) },
    { path: 'modern-demo', loadComponent: () => import('./routing-theory/modern-demo').then(m => m.ModernDemoComponent) },
    {path: 'advance-route/:id', 
        children:[

            {
                path: '',
                loadComponent: () => import('./advance-route/advance-route').then(m => m.AdvanceRoute)
            },
            {
                path: 'relative',
                loadComponent: () => import('./relative/relative').then(m => m.Relative)
            }

        ]
    },
    { path: '', redirectTo: 'theory', pathMatch: 'full' },
    { path: '**', loadComponent: () => import('./not-found/not-found').then(m => m.PageNotFoundComponent) }
];
