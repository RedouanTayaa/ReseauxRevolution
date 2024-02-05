import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { UserRepository } from '@users/repositories/user.repository';
import { UserStubRepository } from '@users/repositories/user-stub.repository';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { userDIProvider } from '@users/_config/UserDIProvider';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        userDIProvider.userLogin,
        { provide: UserRepository, useClass: UserStubRepository },
      ],
      imports: [RouterTestingModule, LoginComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
