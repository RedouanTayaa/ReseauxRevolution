import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostModel } from '@posts/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsSubject = new BehaviorSubject<PostModel[]>([]);
  posts$: Observable<PostModel[]> = this.postsSubject.asObservable();

  setPostLocally(posts: PostModel[]) {
    this.postsSubject.next(posts);
  }

  addPostLocally(post: PostModel) {
    const currentPosts = this.postsSubject.value;
    const updatedPosts = [post, ...currentPosts];
    this.postsSubject.next(updatedPosts);
  }

  editPostLocally(id: number, post: PostModel) {
    const currentPosts = this.postsSubject.value;
    if (currentPosts.findIndex((p) => p.id === id) !== -1) {
      currentPosts[currentPosts.findIndex((p) => p.id === id)] = post;
      this.postsSubject.next(currentPosts);
    }
  }

  removePostLocally(itemId: number) {
    const currentPosts = this.postsSubject.value;
    const updatedPosts = currentPosts.filter(item => item.id !== itemId);
    this.postsSubject.next(updatedPosts);
  }
}
