import { UseCase } from '@base/use-case';
import { PostRepository } from '@posts/repositories/post.repository';
import { Observable } from 'rxjs';

export class PostRemoveUsecase implements UseCase<number, boolean> {
  constructor(private postRepository: PostRepository) {
  }

  execute(id: number): Observable<boolean> {
    return this.postRepository.remove(id);
  }
}
