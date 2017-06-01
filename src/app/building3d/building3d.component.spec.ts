import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Building3dComponent } from './building3d.component';

describe('Building3dComponent', () => {
  let component: Building3dComponent;
  let fixture: ComponentFixture<Building3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Building3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Building3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
