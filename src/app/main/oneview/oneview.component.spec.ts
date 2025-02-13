import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneviewComponent } from './oneview.component';

describe('OneviewComponent', () => {
  let component: OneviewComponent;
  let fixture: ComponentFixture<OneviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
