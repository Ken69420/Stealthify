import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeanonymizationComponent } from './deanonymization.component';

describe('DeanonymizationComponent', () => {
  let component: DeanonymizationComponent;
  let fixture: ComponentFixture<DeanonymizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeanonymizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeanonymizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
