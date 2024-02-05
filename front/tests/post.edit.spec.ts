import { createPostsFixture, PostsFixture } from './posts.fixture';
import { postBuilder } from '@tests/post.builder';

describe("Feature: edit posts", () => {
  let postsFixture: PostsFixture;

  beforeEach(() => {
    postsFixture = createPostsFixture();
  });

  describe("Rule: user edit post", () => {
    test("User has already posts and edit one", async () => {
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

      postsFixture.whenUserEditPost(1, {
        id: 1,
        platform: 'LinkedIn',
        openAiResponse: 'this is a post for LinkedIn',
        createdAt: '2023-11-07T15:00:30.000Z',
        topic: 'a post',
        writingTechnique: 'AIDA',
        choice: 'sales',
        mode: 'Communautaire',
        targetAudience: 'Public général'
      });
      postsFixture.whenUserGetListsPosts();

      postsFixture.thenShouldGetList([
        {
          id: 1,
          platform: 'LinkedIn',
          text: 'this is a post for LinkedIn',
          createdAt: '2023-11-07T15:00:30.000Z',
          topic: 'a post',
          writingTechnique: 'AIDA',
          choice: 'sales',
          mode: 'Communautaire',
          targetAudience: 'Public général'
        }
      ]);
    });
  });
});
