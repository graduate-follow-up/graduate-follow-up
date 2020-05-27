import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnusEditByUrlComponent } from './alumnus-edit-by-url.component';

describe('AlumnusEditByUrlComponent', () => {
  let component: AlumnusEditByUrlComponent;
  let fixture: ComponentFixture<AlumnusEditByUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnusEditByUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnusEditByUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
