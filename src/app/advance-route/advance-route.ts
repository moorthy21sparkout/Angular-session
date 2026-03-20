import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-advance-route',
  imports: [],
  templateUrl: './advance-route.html',
  styleUrl: './advance-route.css',
})
export class AdvanceRoute implements OnInit {
  @Input() id!: string;
  @Input() ref!: any;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    console.log('Received ID:', this.id);
    console.log('Received Ref:', this.ref);

    // If the component is loaded via route, we can also read params and query params here
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
    });

    this.route.queryParams.subscribe(params => {
      console.log('Route Query Params:', params);
    });
    const id = this.route.snapshot.params['id'];
    console.log('Snapshot ID:', id);
  }
    ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges Ref:', this.ref); // 
  }

  clickSamePage() {
    console.log('Clicked on the same page link');
    this.router.navigate(['/advance-route/456'], { queryParams: { ref: 'same-page' } });
  }

  goToRelative() {
    // this.router.navigate(['/advance-route/456/relative'], { queryParams: { ref: 'same-page' } });
    this.router.navigate(['relative'], { relativeTo: this.route });
  }
}
