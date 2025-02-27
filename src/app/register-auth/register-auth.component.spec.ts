import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAuthComponent } from './register-auth.component';

describe('RegisterAuthComponent', () => {
  let component: RegisterAuthComponent;
  let fixture: ComponentFixture<RegisterAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
