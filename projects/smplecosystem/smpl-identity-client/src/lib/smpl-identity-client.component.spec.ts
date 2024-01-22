import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmplIdentityClientComponent } from './smpl-identity-client.component';

describe('SmplIdentityClientComponent', () => {
  let component: SmplIdentityClientComponent;
  let fixture: ComponentFixture<SmplIdentityClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmplIdentityClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmplIdentityClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
