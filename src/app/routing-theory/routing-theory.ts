import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
    selector: 'app-routing-theory',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    animations: [
        trigger('dataFlow', [
            transition('* => *', [
                animate('1s ease-in-out', keyframes([
                    style({ transform: 'translateX(0)', opacity: 0, offset: 0 }),
                    style({ transform: 'translateX(50px)', opacity: 1, offset: 0.5 }),
                    style({ transform: 'translateX(100px)', opacity: 0, offset: 1 })
                ]))
            ])
        ])
    ],
    templateUrl: './routing-theory.html',
    styleUrl: './routing-theory.css'
})
export class RoutingTheoryComponent {
    private router = inject(Router);
    private currentSimId = 100;

    activeSim = signal<string | null>(null);
    isAnimating = signal(false);
    packetContent = signal('');

    simTitle = signal('');
    passCode = signal('');
    getCode = signal('');

    async simulatePass(type: string) {
        this.activeSim.set(type);
        this.isAnimating.set(false);

        if (type === 'params') {
            this.simTitle.set('Route Parameters (ID)');
            this.packetContent.set('ID: 101');
            this.passCode.set(`// URL: /routing/details/101\nthis.router.navigate(['/routing/details', 101]);`);
            this.getCode.set(`// In RoutingChildComponent:\nthis.route.params.subscribe(p => p['id']);`);

            this.startAnim();
            this.router.navigate(['/routing', 'details', '101']);
        }
        else if (type === 'query') {
            this.simTitle.set('Query Parameters (Filter)');
            this.packetContent.set('?type=query&val=dark');
            this.passCode.set(`this.router.navigate(['/routing/details'], {\n  queryParams: { type: 'query', val: 'dark' }\n});`);
            this.getCode.set(`// In RoutingChildComponent:\nthis.route.queryParams.subscribe(p => p['val']);`);

            this.startAnim();
            this.router.navigate(['/routing', 'details'], { queryParams: { type: 'query', val: 'dark' } });
        }
        else if (type === 'state') {
            this.simTitle.set('Navigation State (Hidden Object)');
            this.packetContent.set('{ type: "state", val: "Admin" }');
            this.passCode.set(`this.router.navigateByUrl('/routing/details', {\n  state: { type: 'state', val: 'Admin' }\n});`);
            this.getCode.set(`// In RoutingChildComponent constructor:\nconst nav = this.router.getCurrentNavigation();\nconst state = nav?.extras.state;`);

            this.startAnim();
            this.router.navigateByUrl('/routing/details', {
                state: { type: 'state', val: 'Admin User Object' }
            });
        }
        else if (type === 'updateId') {
            this.currentSimId++;
            if (this.currentSimId === 101) {
                // First click sets up initial state to 101
                this.simTitle.set('Initial Parameter Load');
                this.packetContent.set(`ID: 101`);
                this.passCode.set(`this.router.navigate(['/routing/details', 101]);`);
                this.getCode.set(`// Component created.\n// Snapshot and Subscribe are identical.`);
                this.startAnim();
                this.router.navigate(['/routing', 'details', '101']);
            } else {
                this.simTitle.set('Update Parameter (Component Reused)');
                this.packetContent.set(`ID: ${this.currentSimId}`);
                this.passCode.set(`// Navigate again:\nthis.router.navigate(['/routing/details', ${this.currentSimId}]);`);
                this.getCode.set(`// Component REUSED! ngOnInit is skipped.\n// Snapshot = Stale, Subscribe = Updated`);
                this.startAnim();
                this.router.navigate(['/routing', 'details', this.currentSimId.toString()]);
            }
        }
    }

    private startAnim() {
        setTimeout(() => this.isAnimating.set(true), 50);
    }
}
