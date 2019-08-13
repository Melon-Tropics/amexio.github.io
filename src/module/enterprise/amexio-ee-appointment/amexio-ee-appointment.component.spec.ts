import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmexioWeekDayAvailiblityComponent } from './amexio-ee-appointment.component';
import { LifeCycleBaseComponent } from '../../base/lifecycle.base.component';
describe('DropDownMenu', () => {
  let comp1: AmexioWeekDayAvailiblityComponent;
  let fixture1: ComponentFixture<AmexioWeekDayAvailiblityComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmexioWeekDayAvailiblityComponent],
      providers: [
    ],

    });
    fixture1 = TestBed.createComponent(AmexioWeekDayAvailiblityComponent);
    comp1 = fixture1.componentInstance;    
  });

  it('constructor call ()', () => {
    expect(comp1.setRoundEdge).toBeTruthy();
  });

});