import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { PostModel } from '@posts/models/post.model';
import { postDIProvider } from '@posts/_config/PostDIProvider';
import { PostRemoveUsecase } from '@posts/usecases/post.remove.usecase';
import { PostRepository } from '@posts/repositories/post.repository';
import { Modal } from 'flowbite';
import { PostImplementationRepository } from '@posts/repositories/post-implementation.repository';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-post-remove-modal',
  standalone: true,
  imports: [HttpClientModule],
  providers: [
    postDIProvider.postRemove,
    {provide: PostRepository, useClass: PostImplementationRepository}
  ],
  templateUrl: './post-remove-modal.component.html',
  styleUrl: './post-remove-modal.component.scss'
})
export class PostRemoveModalComponent {
  @Input({required: true}) post!: PostModel;
  @Output() postRemoved = new EventEmitter<boolean>();

  constructor(
    @Inject(postDIProvider.postRemove.provide)
    private postRemoveUsecase: PostRemoveUsecase,
  ) {

  }

  confirmRemove() {
    this.postRemoveUsecase.execute(this.post?.id || 0).subscribe({
      next: () => {
        this.postRemoved.emit(true);
        this.closeModal();
      },
      error: (error) => {
        this.postRemoved.emit(false);
      }
    });
  }

  closeModal() {
    const $modal = document.getElementById('removePostModal' + this.post.id);
    if ($modal) {
      const modal = new Modal($modal);
      modal.hide();
    }
  }
}
