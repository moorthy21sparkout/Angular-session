import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-modern-demo',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './modern-demo.html',
    styleUrl: './modern-demo.css'
})
export class ModernDemoComponent {
    sections = Array.from({ length: 10 }, (_, i) => ({
        id: `section-${i + 1}`,
        title: `Section ${i + 1}`,
        content: `Detailed content for section ${i + 1}. This section exists to create enough height to test scroll restoration and anchor scrolling features of the modern Angular router.`
    }));
}
