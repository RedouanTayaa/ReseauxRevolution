import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAddModalComponent } from './post-add-modal.component';

describe('PostAddModalComponent', () => {
  let component: PostAddModalComponent;
  let fixture: ComponentFixture<PostAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostAddModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
