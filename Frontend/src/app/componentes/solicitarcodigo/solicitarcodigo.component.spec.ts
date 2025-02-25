import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarcodigoComponent } from './solicitarcodigo.component';

describe('SolicitarcodigoComponent', () => {
  let component: SolicitarcodigoComponent;
  let fixture: ComponentFixture<SolicitarcodigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarcodigoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitarcodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
