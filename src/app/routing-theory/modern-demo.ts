import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RouteTrackerService } from '../services/route-tracker-service';

@Component({
    selector: 'app-modern-demo',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './modern-demo.html',
    styleUrl: './modern-demo.css'
})
export class ModernDemoComponent implements OnInit{

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private traker = inject(RouteTrackerService);
    sections = Array.from({ length: 10 }, (_, i) => ({
        id: `section-${i + 1}`,
        title: `Section ${i + 1}`,
        content: `Detailed content for section ${i + 1}. This section exists to create enough height to test scroll restoration and anchor scrolling features of the modern Angular router.`
    }));

    ngOnInit(): void {
        this.route.fragment.subscribe(f => {
            console.log('Current Fragment:', f);
});
console.log('Previous URL:', this.traker.previousUrl);
console.log('Current URL:', this.traker.currentUrl);
    }

    goToadvanceRoutePage() {
        this.router.navigate(['/advance-route/123'], { queryParams: { ref: 'modern-demo' } });
    }

    scrollToSection(sectionId: string) {
        this.router.navigate(['/modern-demo'], { fragment: sectionId });
    }
demo(){
    // this.router.navigateByUrl('/user/101?name=sam#section1');
    this.router.navigate(['/user/101'], {
    queryParams: { name: 'sam' }
    });

}

}
