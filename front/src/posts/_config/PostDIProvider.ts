import {
  postEditUseCaseFactory,
  postGenerateUseCaseFactory,
  postListUseCaseFactory,
  postRemoveUseCaseFactory
} from '@posts/_config/PostDIFactory';
import { PostRepository } from '@posts/repositories/post.repository';

export const postDIProvider = {
  postList: {
    provide: 'postList',
    useFactory: postListUseCaseFactory,
    deps: [PostRepository],
  },
  postGenerate: {
    provide: 'postGenerate',
    useFactory: postGenerateUseCaseFactory,
    deps: [PostRepository],
  },
  postEdit: {
    provide: 'postEdit',
    useFactory: postEditUseCaseFactory,
    deps: [PostRepository],
  },
  postRemove: {
    provide: 'postRemove',
    useFactory: postRemoveUseCaseFactory,
    deps: [PostRepository],
  }
}
