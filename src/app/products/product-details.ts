import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-details.html',
    styleUrls: ['./product-details.css']
})
export class ProductDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    productId = signal<string | null>(null);
    queryParams = signal<any>({});
    productState = signal<any>(null);

    ngOnInit() {
        // 1. Reading Route Params
        this.route.params.subscribe(params => {
            this.productId.set(params['id']);
        });

        // 2. Reading Query Params
        this.route.queryParams.subscribe(params => {
            this.queryParams.set(params);
        });

        // 3. Reading Navigation State
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state) {
            this.productState.set(navigation.extras.state['productData']);
        } else {
            // Alternative: reading from window.history.state (useful if page is refreshed)
            const state = typeof window !== 'undefined' ? window.history.state : null;
            if (state && state.productData) {
                this.productState.set(state.productData);
            }
        }
    }

    goBack() {
        this.router.navigate(['/products']);
    }
}
