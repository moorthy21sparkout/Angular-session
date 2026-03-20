import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Relative } from './relative';

describe('Relative', () => {
  let component: Relative;
  let fixture: ComponentFixture<Relative>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Relative],
    }).compileComponents();

    fixture = TestBed.createComponent(Relative);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
