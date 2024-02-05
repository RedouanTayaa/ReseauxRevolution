import { PostRepository } from '@posts/repositories/post.repository';
import { Observable } from 'rxjs';
import { PostModel } from '@posts/models/post.model';
import { PostEntity } from '@posts/entities/post-entity';
import { Injectable } from '@angular/core';
import { PostMapper } from '@posts/mappers/post.mapper';
import { PostService } from '@posts/services/post.service';

@Injectable({
  providedIn: 'root',
})
export class PostStubRepository implements PostRepository {
  private posts: PostModel[] = [];

  constructor(private postService: PostService) {
    this.postService.posts$.subscribe((posts) => {
      this.posts = posts;
    });
  }

  add(params: PostEntity): Observable<PostModel> {
    params = {
      ...params,
      createdAt: params.createdAt ?? '2023-11-21T21:00:00',
      openAiResponse: params.openAiResponse ?? 'this is a post for facebook'
    }
    let postGenerate = {...new PostMapper().mapFrom(params), id: this.posts.length + 1};
    this.postService.addPostLocally(postGenerate);
    return new Observable(subscriber => {
      subscriber.next(postGenerate);
    });
  }

  edit(id: number, params: PostModel): Observable<PostModel> {
    const postIndex = this.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return new Observable(subscriber => {
        subscriber.error('Post doesn\'t exist');
      });
    }

    this.postService.editPostLocally(id, params);
    return new Observable(subscriber => {
      subscriber.next(params);
    });
  }

  list(params: {}): Observable<PostModel[]> {
    return new Observable(subscriber => {
      subscriber.next(this.posts);
    });
  }

  remove(id: number): Observable<boolean> {
    const postIndex = this.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return new Observable(subscriber => {
        subscriber.error('Post doesn\'t exist');
      });
    }

    this.postService.removePostLocally(id);
    return new Observable(subscriber => {
      subscriber.next(true);
    });
  }

}
