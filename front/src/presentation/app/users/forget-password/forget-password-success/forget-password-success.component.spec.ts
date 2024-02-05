import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordSuccessComponent } from './forget-password-success.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgetPasswordSuccessComponent', () => {
  let component: ForgetPasswordSuccessComponent;
  let fixture: ComponentFixture<ForgetPasswordSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPasswordSuccessComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
