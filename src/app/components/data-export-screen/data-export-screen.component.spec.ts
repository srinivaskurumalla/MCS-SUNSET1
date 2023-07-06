import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExportScreenComponent } from './data-export-screen.component';

describe('DataExportScreenComponent', () => {
  let component: DataExportScreenComponent;
  let fixture: ComponentFixture<DataExportScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataExportScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataExportScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
