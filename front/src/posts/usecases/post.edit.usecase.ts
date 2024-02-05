import { UseCase } from '@base/use-case';
import { PostModel } from '@posts/models/post.model';
import { PostRepository } from '@posts/repositories/post.repository';
import { Observable } from 'rxjs';
import { PostEntity } from '@posts/entities/post-entity';

export class PostEditUsecase implements UseCase<{id: number, post: PostEntity}, PostModel> {
  constructor(private postRepository: PostRepository) {
  }

  execute(params: {id: number, post: PostEntity}): Observable<PostModel> {
    return this.postRepository.edit(params.id, params.post);
  }
}
