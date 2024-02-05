import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRemoveModalComponent } from './post-remove-modal.component';

describe('PostRemoveModalComponent', () => {
  let component: PostRemoveModalComponent;
  let fixture: ComponentFixture<PostRemoveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostRemoveModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostRemoveModalComponent);
    component = fixture.componentInstance;
    component.post = {id: 1, topic: 'test', writingTechnique: 'AIDA', platform: 'FB', createdAt: '2023-11-21', choice: 'sales', mode: 'Communautaire',};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
