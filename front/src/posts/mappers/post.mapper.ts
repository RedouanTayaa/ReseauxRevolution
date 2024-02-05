import { PostEntity } from '@posts/entities/post-entity';
import { PostModel } from '@posts/models/post.model';

export class PostMapper {
  mapFrom(param: PostEntity): PostModel {
    return {
      id: param.id,
      topic: param.topic,
      platform: param.platform,
      choice: param.choice,
      writingTechnique: param.writingTechnique,
      mode: param.mode,
      text: param.openAiResponse,
      createdAt: param.createdAt,
      targetAudience: param.targetAudience
    };
  }

  mapTo(param: PostModel): PostEntity {
    return {
      id: param.id,
      openAiResponse: param.text,
      platform: param.platform,
      topic: param.topic,
      choice: param.choice,
      writingTechnique: param.writingTechnique,
      mode: param.mode,
      createdAt: param.createdAt,
      targetAudience: param.targetAudience
    }
  }
}
