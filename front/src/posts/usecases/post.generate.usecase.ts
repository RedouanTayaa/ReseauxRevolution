import { UseCase } from '@base/use-case';
import { PostModel } from '@posts/models/post.model';
import { PostRepository } from '@posts/repositories/post.repository';
import { Observable } from 'rxjs';
import { PostEntity } from '@posts/entities/post-entity';

export class PostGenerateUsecase implements UseCase<PostEntity, PostModel> {
  constructor(private postRepository: PostRepository) {
  }

  execute(params: PostEntity): Observable<PostModel> {
    return this.postRepository.add(params);
  }
}
