import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HostVisitorsChartComponent } from './visitor-chart.component';



describe('VisitorChartComponent', () => {
  let component: VisitorChartComponent;
  let fixture: ComponentFixture<VisitorChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostVisitorsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
