import { Component, signal, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-theory',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('brickAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.5) translateY(20px)' }),
          stagger(100, [
            animate('300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('packetFlow', [
      state('start', style({ left: '0%', opacity: 1 })),
      state('end', style({ left: '100%', opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('start <=> end', animate('1500ms ease-in-out')),
      transition('* => hidden', animate('300ms ease-out'))
    ])
  ],
  templateUrl: './theory.html',
  styleUrl: './theory.css'
})
export class TheoryComponent {
  private platformId = inject(PLATFORM_ID);
  activeFlow = signal<string | null>(null);
  currentStatus = signal('Idle');
  activeSide = signal('source');
  packetState = signal('hidden');
  packetIcon = signal('🍱');

  constructor() {
    afterNextRender(() => {
      console.log('Safe to use window/document here!');
    });
  }

  stepCount = signal(0);
  detailTitle = signal('Waiting...');
  detailText = signal('Click a card above to begin the simulation.');

  // Modal Demo Signals
  showDemoModal = signal(false);
  modalDemoType = signal<'ssr' | 'csr'>('ssr');
  demoSteps = signal<string[]>([]);
  demoStatus = signal('Idle');

  bricks = signal<string[]>([]);

  openDemoModal(type: 'ssr' | 'csr') {
    this.modalDemoType.set(type);
    this.showDemoModal.set(true);
    this.runModalDemo();
  }

  closeDemoModal() {
    this.showDemoModal.set(false);
    this.demoSteps.set([]);
    this.demoStatus.set('Idle');
  }

  private async runModalDemo() {
    this.demoSteps.set([]);
    if (this.modalDemoType() === 'ssr') {
      this.demoStatus.set('Server is Preparing Full Page...');
      await this.wait(1000);
      this.demoSteps.set(['Building HTML Structure...', 'Fetching Database Records...', 'Injecting CSS/Meta Tags...', 'Compressing Response...']);
      await this.wait(2000);
      this.demoStatus.set('COMPLETE: Full Page Pushed to Browser! 🚀');
    } else {
      this.demoStatus.set('Server is Sending Instruction Blueprint...');
      await this.wait(1000);
      this.demoSteps.set(['Downloading Main.js (5MB)...', 'Booting Angular Runtime...', 'Executing Component Logic...', 'Building DOM Node by Node...']);
      await this.wait(2000);
      this.demoStatus.set('COMPLETE: Page built on Browser! 🏗️');
    }
  }

  reset() {
    this.activeFlow.set(null);
    this.currentStatus.set('Idle');
    this.activeSide.set('source');
    this.packetState.set('hidden');
    this.bricks.set([]);
    this.stepCount.set(0);
  }

  async startFlow(type: string) {
    this.reset();
    this.activeFlow.set(type);

    if (type === 'ssr') await this.runSSR();
    else if (type === 'full-ssr') await this.runFullPageSSR();
    else await this.runCSR();
  }

  private async runFullPageSSR() {
    // 1. Request Hit
    this.setStep(1, 'Incoming Request', 'Server (Node) receives the URL request and prepares the environment.', 'REQUESTED', 'source');
    await this.wait(1500);

    // 2. Data Fetching
    this.setStep(2, 'Backend Data Fetch', 'Server is fetching full page data from the database/API.', 'FETCHING...', 'source');
    this.bricks.set(['db-data', 'auth-context', 'user-prefs']);
    await this.wait(2000);

    // 3. Template Engine
    this.setStep(3, 'Template Compression', 'CommonEngine is stringifying the entire component tree into HTML.', 'STRINGIFYING', 'source');
    this.bricks.set(['html', 'head', 'meta', 'title', 'body', 'app-root', 'header', 'main', 'footer']);
    await this.wait(2000);

    // 4. Delivery
    this.setStep(4, 'Complete Push', 'The full, ready-to-view HTML is sent to the browser in one go.', 'PUSHING...', 'none');
    this.packetIcon.set('📦');
    this.packetState.set('start');
    await this.wait(100);
    this.packetState.set('end');
    await this.wait(1600);

    // 5. Browser Display
    this.packetState.set('hidden');
    this.setStep(5, 'Finished Render', 'Browser displays the full page instantly. No client-side building needed!', 'DISPLAYED', 'dest');
    this.currentStatus.set('COMPLETE (SSR) 🚀');
  }

  private async runSSR() {
    // 1. Server Rendering
    this.setStep(1, 'Server Assembly', 'Server is combining data + templates into actual HTML bricks.', 'CONSTRUCTING...', 'source');
    this.bricks.set(['html', 'body', 'ul', 'li', 'li', 'div', 'p', 'span']);
    await this.wait(2000);

    // 2. Network Flow
    this.setStep(2, 'HTML Delivery', 'The completed HTML "Plate" is traveling across the network.', 'DELIVERING...', 'none');
    this.packetIcon.set('🍱');
    this.packetState.set('start');
    await this.wait(100);
    this.packetState.set('end');
    await this.wait(1600);

    // 3. Browser Display
    this.packetState.set('hidden');
    this.setStep(3, 'Instant Render', 'The browser receives the HTML and paints it instantly. Users see content now!', 'DISPLAYED', 'dest');
    await this.wait(2000);

    // 4. Hydration
    this.setStep(4, 'Hydration', 'JavaScript wakes up, connects to the HTML, and makes the page alive.', 'HYDRATING', 'dest');
  }

  private async runCSR() {
    // 1. Server Check
    this.setStep(1, 'Blueprint Ready', 'Server prepares the minimal instructions (Blueprint).', 'PREPARING...', 'source');
    await this.wait(1000);

    // 2. Network Flow
    this.setStep(2, 'Sending Blueprint', 'Browser downloads the empty shell + JS files.', 'DELIVERING...', 'none');
    this.packetIcon.set('📄');
    this.packetState.set('start');
    await this.wait(100);
    this.packetState.set('end');
    await this.wait(1600);

    // 3. Browser Work
    this.packetState.set('hidden');
    this.setStep(3, 'Instruction Load', 'Browser is running JavaScript to decide what to build.', 'BUILDING...', 'dest');
    await this.wait(1500);

    // 4. Rendering
    this.setStep(4, 'Client Assembly', 'Browser is now building the components one by one on the client side.', 'CONSTRUCTING...', 'dest');
    this.bricks.set(['div', 'app-root', 'header', 'nav', 'main', 'card', 'footer']);
    await this.wait(2000);

    this.currentStatus.set('COMPLETE ✨');
  }

  private setStep(count: number, title: string, text: string, status: string, side: string) {
    this.stepCount.set(count);
    this.detailTitle.set(title);
    this.detailText.set(text);
    this.currentStatus.set(status);
    this.activeSide.set(side);
  }

  private wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
