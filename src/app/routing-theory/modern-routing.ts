import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-modern-routing',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modern-routing.html',
    styleUrl: './modern-routing.css'
})
export class ModernRoutingComponent {
    private router = inject(Router);
    logs = signal<{ type: string; message: string; time: string }[]>([]);

    constructor() {
        this.router.events.pipe(
            filter(event =>
                event instanceof NavigationStart ||
                event instanceof NavigationEnd ||
                event instanceof RoutesRecognized
            )
        ).subscribe(event => {
            this.addLog(event);
        });
    }

    addLog(event: any) {
        let message = '';
        let type = 'info';

        if (event instanceof NavigationStart) {
            console.log("NavigationStart", event);
        } else if (event instanceof RoutesRecognized) {
            console.log("RoutesRecognized", event);
            const demoId = event.state.root.queryParams['demoId'];
            console.log("demoId", demoId);
        } else if (event instanceof NavigationEnd) {
            console.log("NavigationEnd", event);

        }

        const newLog = {
            type,
            message,
            time: new Date().toLocaleTimeString()
        };

        this.logs.update(prev => [newLog, ...prev].slice(0, 5));
    }

    testNavigate(id: string) {
        this.router.navigate(['/modern-routing'], { queryParams: { demoId: id } });
    }

    clearLogs() {
        this.logs.set([]);
    }
}
