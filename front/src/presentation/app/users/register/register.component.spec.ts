import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { userDIProvider } from '@users/_config/UserDIProvider';
import { UserRepository } from '@users/repositories/user.repository';
import { UserStubRepository } from '@users/repositories/user-stub.repository';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        userDIProvider.userRegister,
        { provide: UserRepository, useClass: UserStubRepository },
      ],
      imports: [RegisterComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
