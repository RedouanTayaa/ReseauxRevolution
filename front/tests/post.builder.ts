import { PostEntity } from '@posts/entities/post-entity';

export const postBuilder = (
  {
    id = 1,
    topic = 'some text',
    createdAt = '2023-02-08T15:00:00.000Z',
    platform = 'some type',
    writingTechnique = 'AIDA',
    openAiResponse = 'text from openai',
    choice = 'sales',
    mode = 'Communautaire',
    targetAudience = 'Public général',
  }: {
    id?: number;
    topic?: string;
    platform?: string;
    writingTechnique?: string;
    openAiResponse?: string;
    createdAt?: string;
    choice?: string;
    mode?: string;
    targetAudience?: string;
  } = {}) => {
  const props = { id, topic, platform, writingTechnique, openAiResponse, createdAt, choice, mode, targetAudience };

  return {
    withId(_id: number) {
      return postBuilder({
        ...props,
        id: _id,
      });
    },
    withTopic(_topic: string) {
      return postBuilder({
        ...props,
        topic: _topic,
      });
    },
    withPlatform(_platform: string) {
      return postBuilder({
        ...props,
        platform: _platform,
      });
    },
    choice(_choice: string) {
      return postBuilder({
        ...props,
        choice: _choice,
      });
    },
    writingTechnique(_writingTechnique: string) {
      return postBuilder({
        ...props,
        writingTechnique: _writingTechnique,
      });
    },
    mode(_mode: string) {
      return postBuilder({
        ...props,
        mode: _mode,
      });
    },
    openAiResponse(_openAiResponse: string) {
      return postBuilder({
        ...props,
        openAiResponse: _openAiResponse,
      });
    },
    targetAudience(_targetAudience: string) {
      return postBuilder({
        ...props,
        targetAudience: _targetAudience,
      });
    },
    createdAt(_createdAt: string) {
      return postBuilder({
        ...props,
        createdAt: _createdAt,
      });
    },
    build(): PostEntity {
      return {
        id: props.id,
        openAiResponse: props.openAiResponse,
        topic: props.topic,
        platform: props.platform,
        choice: props.choice,
        writingTechnique: props.writingTechnique,
        mode: props.mode,
        targetAudience: props.targetAudience,
        createdAt: props.createdAt,
      };
    },
  };
};
