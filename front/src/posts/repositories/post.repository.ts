import { Observable } from 'rxjs';
import { PostModel } from '@posts/models/post.model';
import { PostEntity } from '@posts/entities/post-entity';

export abstract class PostRepository {
  abstract list(params: {}): Observable<PostModel[]>;
  abstract add(params: PostEntity): Observable<PostModel>;
  abstract edit(id: number, params: PostEntity): Observable<PostModel>;
  abstract remove(id: number): Observable<boolean>;
}
