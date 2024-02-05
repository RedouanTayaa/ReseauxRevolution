import { createPostsFixture, PostsFixture } from './posts.fixture';
import { postBuilder } from '@tests/post.builder';

describe("Feature: list posts", () => {
  let postsFixture: PostsFixture;

  beforeEach(() => {
    postsFixture = createPostsFixture();
  });

  describe("Rule: user lists all posts", () => {
    test("User has already posts and lists there", async () => {
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

      await postsFixture.whenUserGetListsPosts();

      postsFixture.thenShouldGetList([
        {
          id: 1,
          platform: 'facebook',
          text: 'this is a posts for facebook',
          createdAt: '2023-11-07T15:00:30.000Z',
          topic: 'a post',
          writingTechnique: 'AIDA',
          choice: 'sales',
          mode: 'Communautaire',
          targetAudience: 'Public général'
        }
      ]);
    });

    test("User didn't have yet posts and lists an empty result", async () => {
      postsFixture.givenThePostsExist([])

      await postsFixture.whenUserGetListsPosts();

      postsFixture.thenShouldGetList([]);
    });
  });
});
