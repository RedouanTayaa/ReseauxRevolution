import { createPostsFixture, PostsFixture } from './posts.fixture';
import { postBuilder } from '@tests/post.builder';

describe("Feature: generate posts", () => {
  let postsFixture: PostsFixture;

  beforeEach(() => {
    postsFixture = createPostsFixture();
  });

  describe("Rule: user genereate post", () => {
    test("User has already posts and add one", async () => {
      postsFixture.givenThePostsExist([
        postBuilder()
          .withId(1)
          .withPlatform('facebook')
          .writingTechnique('AIDA')
          .openAiResponse('this is a posts for facebook')
          .withTopic('a post')
          .choice('Sales')
          .mode('Communautaire')
          .createdAt('2023-11-07T15:00:30.000Z')
          .build()
      ])

      postsFixture.whenUserGeneratePost({
        platform: 'LinkedIn',
        openAiResponse: 'this is a post for LinkedIn',
        createdAt: '2023-11-21T13:00:30.000Z',
        topic: 'a post',
        writingTechnique: 'AIDA',
        choice: 'Publication',
        mode: 'Communautaire',
        targetAudience: 'Public général'
      });
      postsFixture.whenUserGetListsPosts();

      postsFixture.thenShouldGetList([
        {
          id: 2,
          platform: 'LinkedIn',
          text: 'this is a post for LinkedIn',
          createdAt: '2023-11-21T13:00:30.000Z',
          topic: 'a post',
          writingTechnique: 'AIDA',
          choice: 'Publication',
          mode: 'Communautaire',
          targetAudience: 'Public général'
        },
        {
          id: 1,
          platform: 'facebook',
          text: 'this is a posts for facebook',
          createdAt: '2023-11-07T15:00:30.000Z',
          topic: 'a post',
          writingTechnique: 'AIDA',
          choice: 'Sales',
          mode: 'Communautaire',
          targetAudience: 'Public général'
        },
      ]);
    });
  });
});
