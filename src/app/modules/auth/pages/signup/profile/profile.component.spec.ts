import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileFormService } from './profile.form.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockProfileFormService: jest.Mocked<ProfileFormService>;

  beforeEach(async () => {
    mockProfileFormService = {
      form: new FormGroup({
        name: new FormControl(''),
        gender: new FormControl(''),
        age: new FormControl(''),
        height: new FormControl(''),
        currentWeight: new FormControl(''),
        unitSystem: new FormControl(''),
      }),
    } as unknown as jest.Mocked<ProfileFormService>;

    await TestBed.configureTestingModule({
      providers: [
        { provide: ProfileFormService, useValue: mockProfileFormService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
