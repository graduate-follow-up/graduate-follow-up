import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnusEditComponent } from './alumnus-edit.component';

describe('AlumnusModifyComponent', () => {
  let component: AlumnusEditComponent;
  let fixture: ComponentFixture<AlumnusEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnusEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
