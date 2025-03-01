import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotasshowComponent } from './mascotasshow.component';

describe('MascotasshowComponent', () => {
  let component: MascotasshowComponent;
  let fixture: ComponentFixture<MascotasshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotasshowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotasshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
