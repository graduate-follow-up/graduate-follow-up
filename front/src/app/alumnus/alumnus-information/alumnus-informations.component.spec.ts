import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnusInformationsComponent } from './alumnus-informations.component';

describe('AlumnusInformationsComponent', () => {
  let component: AlumnusInformationsComponent;
  let fixture: ComponentFixture<AlumnusInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnusInformationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnusInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
