import { Component, Inject } from '@angular/core';
import { PostPlatformType } from '@posts/models/post.platform.type';
import { PostWritingType } from '@posts/models/post.writing.type';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { postDIProvider } from '@posts/_config/PostDIProvider';
import { PostRepository } from '@posts/repositories/post.repository';
import { PostGenerateUsecase } from '@posts/usecases/post.generate.usecase';
import { Output, EventEmitter } from '@angular/core';
import { PostImplementationRepository } from '@posts/repositories/post-implementation.repository';
import { Modal } from 'flowbite';
import { PostModeType } from '@posts/models/post.mode.type';
import { Tooltip, TooltipOptions, TooltipInterface, InstanceOptions } from 'flowbite';
import { JsonPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-post-add-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JsonPipe,
    NgClass,
  ],
  providers: [
    postDIProvider.postGenerate,
    {provide: PostRepository, useClass: PostImplementationRepository}
  ],
  templateUrl: './post-add-modal.component.html',
  styleUrl: './post-add-modal.component.scss'
})
export class PostAddModalComponent {
  platforms = PostPlatformType;
  writingTypes = PostWritingType;
  modeTypesByPlatform = PostModeType;
  modeTypes: {option: string, value: string}[] = [];
  isSubmitted = false;
  postAddForm!: FormGroup;
  @Output() postGenerated = new EventEmitter<boolean>();

  constructor(
    @Inject(postDIProvider.postGenerate.provide)
    private postGenerateUseCase: PostGenerateUsecase,
    private formBuilder: FormBuilder,
    ) {
    this.initForm();
  }

  initForm() {
    this.postAddForm  =  this.formBuilder.group({
      platform: ['', Validators.required],
      choice: ['publication', Validators.required],
      writingTechnique: [null],
      mode: ['', Validators.required],
      topic: ['', Validators.required],
      targetAudience: ['Public général', Validators.required]
    });

    this.postAddForm?.get('choice')?.valueChanges
      .subscribe(value => {
          if(value === 'sales') {
            this.postAddForm?.get('writingTechnique')?.setValidators(Validators.required);
            this.postAddForm?.get('writingTechnique')?.setValue('');
            this.postAddForm?.get('mode')?.clearValidators();
            this.postAddForm?.get('mode')?.setValue(null);
            this.postAddForm?.get('mode')?.setErrors({'required': null});
            this.postAddForm?.get('mode')?.updateValueAndValidity();
          } else {
            this.postAddForm?.get('mode')?.setValidators(Validators.required);
            this.postAddForm?.get('mode')?.setValue('');
            this.postAddForm?.get('writingTechnique')?.clearValidators();
            this.postAddForm?.get('writingTechnique')?.setValue(null);
            this.postAddForm?.get('writingTechnique')?.setErrors({'required': null});
            this.postAddForm?.get('writingTechnique')?.updateValueAndValidity();
          }
        }
      );

    this.postAddForm?.get('platform')?.valueChanges
      .subscribe((value: 'Facebook' | 'LinkedIn' | 'Instagram' | 'Twitter') => {
          this.modeTypes = this.modeTypesByPlatform[value];
        }
      );
  }

  generatePost() {
    if(this.postAddForm.invalid) {
      return;
    }
    this.isSubmitted = true;

    this.postGenerateUseCase.execute(this.postAddForm.value).subscribe({
      next: (post) => {
        this.postGenerated.emit(true);
        this.initForm();
        this.isSubmitted = false;
        this.closeModal();
      },
      error: (error) => {
        this.postGenerated.emit(false);
        this.isSubmitted = false;
      }
    });
  }

  closeModal() {
    const $modal = document.getElementById('addPostModal');
    if ($modal) {
      const modal = new Modal($modal);
      modal.hide();
    }
  }

  showHelpTooltip() {
    const $targetEl: HTMLElement | null = document.getElementById('tooltip-writing-type');
    const $triggerEl: HTMLElement | null = document.getElementById('tooltip-help');
    const options: TooltipOptions = {
      placement: 'top',
      triggerType: 'click',
    };
    const instanceOptions: InstanceOptions = {
      id: 'tooltipContent',
      override: true
    };

    const tooltip: TooltipInterface = new Tooltip($targetEl, $triggerEl, options, instanceOptions);
    tooltip.toggle();
  }
}
