import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasPage } from './citas-page';

describe('CitasPage', () => {
  let component: CitasPage;
  let fixture: ComponentFixture<CitasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
