import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutProtected } from './layout-protected';

describe('LayoutProtected', () => {
  let component: LayoutProtected;
  let fixture: ComponentFixture<LayoutProtected>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutProtected]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutProtected);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
