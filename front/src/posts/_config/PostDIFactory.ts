import { PostRepository } from '@posts/repositories/post.repository';
import { PostListUsecase } from '@posts/usecases/post.list.usecase';
import { PostGenerateUsecase } from '@posts/usecases/post.generate.usecase';
import { PostEditUsecase } from '@posts/usecases/post.edit.usecase';
import { PostRemoveUsecase } from '@posts/usecases/post.remove.usecase';

export const postListUseCaseFactory =
  (postRepo: PostRepository) => new PostListUsecase(postRepo);

export const postGenerateUseCaseFactory =
  (postRepo: PostRepository) => new PostGenerateUsecase(postRepo);

export const postEditUseCaseFactory =
  (postRepo: PostRepository) => new PostEditUsecase(postRepo);

export const postRemoveUseCaseFactory =
  (postRepo: PostRepository) => new PostRemoveUsecase(postRepo);
