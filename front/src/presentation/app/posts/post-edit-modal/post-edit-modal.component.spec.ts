import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditModalComponent } from './post-edit-modal.component';

describe('PostEditModalComponent', () => {
  let component: PostEditModalComponent;
  let fixture: ComponentFixture<PostEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEditModalComponent);
    component = fixture.componentInstance;
    component.post = {id: 1, topic: 'test', writingTechnique: 'AIDA', platform: 'FB', createdAt: '2023-11-21', choice: 'sales', mode: 'Communautaire',};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
