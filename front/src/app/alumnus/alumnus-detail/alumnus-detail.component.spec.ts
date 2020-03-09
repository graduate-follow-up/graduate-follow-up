import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnusDetailComponent } from './alumnus-detail.component';

describe('AlumnusDetailComponent', () => {
  let component: AlumnusDetailComponent;
  let fixture: ComponentFixture<AlumnusDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnusDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
