import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CheckInComponent } from './check-in.component';
import { CheckInFormService } from './check-in.form.service';

describe('CheckInComponent', () => {
  let component: CheckInComponent;
  let fixture: ComponentFixture<CheckInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CheckInComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      providers: [CheckInFormService],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form by default', () => {
    expect(component.isValid).toBe(true);
  });

  it('should have Monday as default check-in day', () => {
    expect(component.value.checkInDay).toBe('Monday');
  });

  it('should have all seven days of the week available', () => {
    expect(component.checkInDays).toHaveLength(7);
    expect(component.checkInDays).toContain('Monday');
    expect(component.checkInDays).toContain('Sunday');
  });

  it('should return appropriate icons for each day', () => {
    expect(component.getDayIcon('Monday')).toBe('monday');
    expect(component.getDayIcon('Saturday')).toBe('weekend');
    expect(component.getDayIcon('Sunday')).toBe('weekend');
  });
});
