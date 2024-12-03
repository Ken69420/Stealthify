import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymizationComponent } from './anonymization.component';

describe('AnonymizationComponent', () => {
  let component: AnonymizationComponent;
  let fixture: ComponentFixture<AnonymizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonymizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnonymizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
