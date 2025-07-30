import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format numbers with commas', () => {
    const formattedNumber = component.formatNumber('1000000');
    expect(formattedNumber).toBe('1,000,000');
  });

  it('should format time correctly', () => {
    const formattedTime = component.formatTime(3661);
    expect(formattedTime).toBe('1 hours, 1 minutes');
  });
});