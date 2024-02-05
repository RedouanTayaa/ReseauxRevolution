import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { PostModel } from '@posts/models/post.model';
import { PostPlatformType } from '@posts/models/post.platform.type';
import { PostWritingType } from '@posts/models/post.writing.type';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { postDIProvider } from '@posts/_config/PostDIProvider';
import { PostEditUsecase } from '@posts/usecases/post.edit.usecase';
import { PostRepository } from '@posts/repositories/post.repository';
import { HttpClientModule } from '@angular/common/http';
import { Modal } from 'flowbite';
import { PostImplementationRepository } from '@posts/repositories/post-implementation.repository';
import { PostMapper } from '@posts/mappers/post.mapper';
import { copyToClipboard } from '@core/services/clipboard';
import { Tooltip, TooltipOptions, TooltipInterface, InstanceOptions } from 'flowbite';

@Component({
  selector: 'app-post-edit-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    postDIProvider.postEdit,
    {provide: PostRepository, useClass: PostImplementationRepository}
  ],
  templateUrl: './post-edit-modal.component.html',
  styleUrl: './post-edit-modal.component.scss'
})
export class PostEditModalComponent implements OnInit {
  @Input({required: true}) post!: PostModel;
  platforms = PostPlatformType;
  writingTypes = PostWritingType;
  isSubmitted = false;
  @Output() postEdited = new EventEmitter<boolean>();

  postEditForm!: FormGroup;
  postMapper = new PostMapper();

  constructor(
    @Inject(postDIProvider.postEdit.provide)
    private postEditUsecase: PostEditUsecase,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.postEditForm  =  this.formBuilder.group({
      id: [this.post?.id, Validators.required],
      //platform: [this.post?.platform, Validators.required],
      type: [this.post?.writingTechnique, Validators.required],
      topic: [this.post?.topic, Validators.required],
      text: [this.post?.text, Validators.required],
      createdAt: [this.post?.createdAt, Validators.required],
    });
  }

  editPost() {
    if(this.postEditForm.invalid) {
      return;
    }
    this.isSubmitted = true;

    this.postEditUsecase.execute({id: this.post.id || 0, post: this.postMapper.mapTo(this.postEditForm.value)}).subscribe({
      next: (post) => {
        this.postEdited.emit(true);
        this.closeModal();
        this.isSubmitted = false;
      },
      error: (error) => {
        this.postEdited.emit(false);
        this.isSubmitted = false;
      }
    });
  }

  closeModal() {
    const $modal = document.getElementById('editPostModal' + this.post.id);
    if ($modal) {
      const modal = new Modal($modal);
      modal.hide();
    }
  }

  copy() {
    const $targetEl: HTMLElement | null = document.getElementById('tooltip-copied');
    const $triggerEl: HTMLElement | null = document.getElementById('button-copy');
    const options: TooltipOptions = {
      placement: 'top',
      triggerType: 'click',
    };
    const instanceOptions: InstanceOptions = {
      id: 'tooltipContent',
      override: true
    };

    const tooltip: TooltipInterface = new Tooltip($targetEl, $triggerEl, options, instanceOptions);

    copyToClipboard({
      value: this.postEditForm.controls['text'].value
    }).then(() => {
        tooltip.show();

        setTimeout(() => {
          tooltip.hide();
        }, 3000);
      }
    )
  }
}
