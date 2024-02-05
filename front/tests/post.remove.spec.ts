import { createPostsFixture, PostsFixture } from './posts.fixture';
import { postBuilder } from '@tests/post.builder';

describe("Feature: remove posts", () => {
  let postsFixture: PostsFixture;

  beforeEach(() => {
    postsFixture = createPostsFixture();
  });

  describe("Rule: user remove post", () => {
    test("User has already posts and remove one", async () => {
      postsFixture.givenThePostsExist([
        postBuilder()
          .withId(1)
          .withPlatform('facebook')
          .writingTechnique('AIDA')
          .openAiResponse('this is a posts for facebook')
          .withTopic('a post')
          .createdAt('2023-11-07T15:00:30.000Z')
          .build()
      ])

      postsFixture.whenUserRemovePost(1);
      postsFixture.whenUserGetListsPosts();

      postsFixture.thenShouldGetList([]);
    });
  });
});
