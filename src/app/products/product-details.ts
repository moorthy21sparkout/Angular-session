import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="product-details-container">
      <h2>Product Details</h2>
      
      <div class="info-card">
        <h3>1. Route Parameters (/:id)</h3>
        <p>Current ID: <strong>{{ productId() }}</strong></p>
      </div>

      <div class="info-card">
        <h3>2. Query Parameters (?from=...&mode=...)</h3>
        <p>From: <strong>{{ queryParams().from || 'N/A' }}</strong></p>
        <p>Mode: <strong>{{ queryParams().mode || 'N/A' }}</strong></p>
      </div>

      <div class="info-card">
        <h3>3. Navigation State (Passed via Router)</h3>
        <div *ngIf="productState(); else noState">
          <p>Product Title (from state): <strong>{{ productState().title }}</strong></p>
          <p>Product Price (from state): <strong>{{ productState().price | currency }}</strong></p>
        </div>
        <ng-template #noState>
          <p>No state data found. Try navigating via the "NavigateByUrl" button in the products list.</p>
        </ng-template>
      </div>

      <button (click)="goBack()" class="btn-back">Back to Products</button>
    </div>
  `,
    styles: [`
    .product-details-container {
      padding: 30px;
      max-width: 800px;
      margin: 0 auto;
    }
    .info-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border-left: 5px solid #3b82f6;
    }
    .btn-back {
      padding: 12px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }
    .btn-back:hover {
      background: #2563eb;
    }
  `]
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
