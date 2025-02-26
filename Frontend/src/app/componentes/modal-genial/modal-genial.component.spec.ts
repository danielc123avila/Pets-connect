import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenailComponent } from './modal-genial.component';

describe('ModalGenailComponent', () => {
  let component: ModalGenailComponent;
  let fixture: ComponentFixture<ModalGenailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalGenailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGenailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
