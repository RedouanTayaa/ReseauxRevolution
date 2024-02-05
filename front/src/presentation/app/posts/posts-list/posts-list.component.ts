import { Component, Inject, OnInit, Signal, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { postDIProvider } from '@posts/_config/PostDIProvider';
import { PostRepository } from '@posts/repositories/post.repository';
import { PostListUsecase } from '@posts/usecases/post.list.usecase';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { HttpClientModule } from '@angular/common/http';
import { PostModel } from '@posts/models/post.model';
import { HeaderNavbarComponent } from '@presentation/app/header-navbar/header-navbar.component';
import { PostStubRepository } from '@posts/repositories/post-stub.repository';
import { PostAddModalComponent } from '@presentationPosts/post-add-modal/post-add-modal.component';
import { PostEditModalComponent } from '@presentationPosts/post-edit-modal/post-edit-modal.component';
import { PostRemoveModalComponent } from '@presentationPosts/post-remove-modal/post-remove-modal.component';
import { PostService } from '@posts/services/post.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Modal } from 'flowbite';
import { PostImplementationRepository } from '@posts/repositories/post-implementation.repository';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { CustomDateFormatPipe } from '@core/pipes/custom.format.pipe';

@Component({
  standalone: true,
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  imports: [
    HttpClientModule,
    NgToastModule,
    HeaderNavbarComponent,
    PostAddModalComponent,
    PostEditModalComponent,
    PostRemoveModalComponent,
    CommonModule,
    TruncatePipe,
    CustomDateFormatPipe
  ],
  providers: [
    postDIProvider.postList,
    {provide: PostRepository, useClass: PostImplementationRepository}
  ]
})
export class PostsListComponent implements OnInit {
  posts$: Signal<PostModel[]> = signal([]);

  constructor(
    @Inject(postDIProvider.postList.provide)
    private postListUseCase: PostListUsecase,
    private toastService: NgToastService,
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {
    this.posts$ = toSignal(this.postService.posts$, {initialValue: []});
  }

  ngOnInit() {
    this.postListUseCase.execute({}).subscribe({
      error: (error) => {
        this.toastService.error({detail: 'Erreur', summary: error.message ?? 'Une erreur est survenue. Veuillez réessayer dans quelques instants', duration: 5000});
      }
    });
  }

  openModal(modalId: string) {
    const $modal = document.getElementById(modalId);
    if ($modal) {
      const modal = new Modal($modal, {backdrop: 'static', closable: false});
      modal.show();
    }
  }

  postAdded(generated: boolean) {
    if (generated) {
      if (this.posts$() && this.posts$().length > 0) {
        this.cdr.detectChanges();
        this.openModal('editPostModal' + this.posts$()[0].id);
      }
      this.toastService.success({detail: 'Succès', summary: 'Post généré', duration: 5000});
    } else {
      this.toastService.error({detail: 'Erreur', summary: 'Une erreur a été déclenchée, veuillez réessayer dans quelques instants', duration: 5000});
    }
  }

  postEdited(edited: boolean) {
    if (edited) {
      this.toastService.success({detail: 'Succès', summary: 'Post édité', duration: 5000});
    } else {
      this.toastService.error({detail: 'Erreur', summary: 'Une erreur a été déclenchée, veuillez réessayer dans quelques instants', duration: 5000});
    }
  }

  postRemoved(removed: boolean) {
    if (removed) {
      this.toastService.success({detail: 'Succès', summary: 'Post supprimé', duration: 5000});
    } else {
      this.toastService.error({detail: 'Erreur', summary: 'Une erreur a été déclenchée, veuillez réessayer dans quelques instants', duration: 5000});
    }
  }
}
