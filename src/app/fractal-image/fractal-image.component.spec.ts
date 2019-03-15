import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FractalImageComponent } from './fractal-image.component';

describe('FractalImageComponent', () => {
  let component: FractalImageComponent;
  let fixture: ComponentFixture<FractalImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FractalImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FractalImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
