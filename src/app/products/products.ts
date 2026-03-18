import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  private router = inject(Router);
  products = signal<Product[]>([]);
  loading = signal(true);

  async ngOnInit() {
    try {
      // Using a real API for demonstration
      const res = await fetch('https://fakestoreapi.com/products?limit=8');
      const data = await res.json();
      this.products.set(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      // Fallback mock data if API is down
      this.products.set([
        { id: 1, title: 'Demo Item 1', price: 29.99, description: 'Pre-rendered by SSR', image: '' },
        { id: 2, title: 'Demo Item 2', price: 49.99, description: 'Pre-rendered by SSR', image: '' }
      ]);
    } finally {
      this.loading.set(false);
    }
  }

  // Method 2: router.navigate with query params
  navigateToProduct(id: number) {
    this.router.navigate(['/products', id], {
      queryParams: { from: 'list', mode: 'view' }
    });
  }

  // Method 3: router.navigateByUrl with state
  navigateToProductWithState(product: Product) {
    this.router.navigateByUrl(`/products/${product.id}`, {
      state: { productData: product }
    });
  }
}
