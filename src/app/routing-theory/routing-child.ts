import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-routing-child',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routing-child.html',
  styleUrl: './routing-child.css'
})
export class RoutingChildComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = signal<string | null>(null);
  snapshotId = signal<string | null>(null);
  query = signal<string | null>(null);
  stateData = signal<string | null>(null);
  type = signal<string | null>(null);

  constructor() {
    //  GET STATE (Passed via navigateByUrl)
    // CRITICAL: getCurrentNavigation() is only available in the constructor during navigation!
    const navigation = this.router.getCurrentNavigation();
    console.log(' Receiver [Constructor] captured navigation:', navigation);
    const state = navigation?.extras.state;
    console.log(' Receiver [Constructor] captured state:', state);

    if (state && state['type'] === 'state') {
      this.stateData.set(state['val']);
      this.type.set('state');
    }
  }

  ngOnInit() {
    // GET INITIAL SNAPSHOT
    const initialId = this.route.snapshot.paramMap.get('id');
    if (initialId) {
      this.snapshotId.set(initialId);
    } else {
      // if we're on /details but simulating param later
      this.snapshotId.set('None');
    }

    // GET ROUTE PARAMS (from /details/:id) (SUBSCRIBE)
    this.route.params.subscribe(p => {
      console.log(' Receiver [ngOnInit] captured params:', p);
      if (p['id']) {
        this.id.set(p['id']);
        this.type.set('param');
        // keep snapshotId what it was on init!
      }
    });

    //GET QUERY PARAMS (from ?type=query)
    this.route.queryParams.subscribe(p => {
      console.log(' Receiver [ngOnInit] captured queryParams:', p);
      if (p['type'] === 'query') {
        this.query.set(p['val']);
        this.type.set('query');
        this.id.set(null);
        this.stateData.set(null);
      } else if (p['type'] === 'param') {
        // simulated param from theory view
        this.id.set(p['val']);
        this.type.set('param');
        this.query.set(null);
        this.stateData.set(null);
      }
    });
  }
}
