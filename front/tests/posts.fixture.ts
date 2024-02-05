import { PostModel } from '@posts/models/post.model';
import { PostStubRepository } from '@posts/repositories/post-stub.repository';
import { PostListUsecase } from '@posts/usecases/post.list.usecase';
import { PostGenerateUsecase } from '@posts/usecases/post.generate.usecase';
import { PostEditUsecase } from '@posts/usecases/post.edit.usecase';
import { PostEntity } from '@posts/entities/post-entity';
import { PostRemoveUsecase } from '@posts/usecases/post.remove.usecase';
import { PostMapper } from '@posts/mappers/post.mapper';
import { PostService } from '@posts/services/post.service';

export const createPostsFixture = () => {
  const postRepository = new PostStubRepository(new PostService());
  const listPostsUseCase = new PostListUsecase(postRepository);
  const postGenerateUseCase = new PostGenerateUsecase(postRepository);
  const postEditUseCase = new PostEditUsecase(postRepository);
  const postRemoveUseCase = new PostRemoveUsecase(postRepository);
  let listPosts: PostModel[];
  let postFromRepo: PostModel;
  let isRemove: boolean;

  return {
    givenThePostsExist(posts: PostModel[]) {
      for (let i = 0; i <= posts.length - 1; i++) {
        postRepository.add(posts[i]);
      }
    },
    whenUserGetListsPosts() {
      listPostsUseCase.execute({}).subscribe(posts => {
        listPosts = posts;
      });
    },
    whenUserGeneratePost(params: PostEntity) {
      postGenerateUseCase.execute(params).subscribe(post => {
        postFromRepo = post;
      });
    },
    whenUserEditPost(id: number, params: PostEntity) {
      postEditUseCase.execute({id: id, post: new PostMapper().mapFrom(params)}).subscribe(post => {
        postFromRepo = post;
      });
    },
    whenUserRemovePost(id: number) {
      postRemoveUseCase.execute(id).subscribe(removed => {
        isRemove = removed;
      });
    },
    thenShouldGetList(expectedListPosts: PostModel[]) {
      expect(listPosts).toEqual(expectedListPosts)
    }
  }
}

export type PostsFixture = ReturnType<typeof createPostsFixture>;
