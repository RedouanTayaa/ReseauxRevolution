import { PostRepository } from '@posts/repositories/post.repository';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PostModel } from '@posts/models/post.model';
import { HttpClient } from '@angular/common/http';
import { PostMapper } from '@posts/mappers/post.mapper';
import { ApiResponse } from '@core/types';
import { environment } from '@environment/environment';
import { PostEntity } from '@posts/entities/post-entity';
import { Injectable } from '@angular/core';
import { PostService } from '@posts/services/post.service';

@Injectable({
  providedIn: 'root',
})
export class PostImplementationRepository implements PostRepository {
  postMapper = new PostMapper();

  constructor(private http: HttpClient, private postService: PostService) {}
  add(params: PostEntity): Observable<PostModel> {
    return this.http
      .post<ApiResponse<PostEntity>>(environment.apiUrl + '/publications', {...params}).pipe(
        map((response: ApiResponse<PostEntity>) => {
          if (response.data === undefined) {
            throw new Error('Données non disponibles');
          }

          let postAddModel = this.postMapper.mapFrom(response.data);
          this.postService.addPostLocally(postAddModel);
          return postAddModel;
        }),
        catchError((err) => {
          throw new Error(err.error?.message);
        })
      );
  }

  edit(id: number, params: {}): Observable<PostModel> {
    return this.http
      .put<ApiResponse<PostEntity>>(environment.apiUrl + '/publications/'+id, {...params}).pipe(
        map((response: ApiResponse<PostEntity>) => {
          if (response.data === undefined) {
            throw new Error('Données non disponibles');
          }
          let postEditModel = this.postMapper.mapFrom(response.data)
          this.postService.editPostLocally(id, postEditModel);
          return postEditModel;
        }),
        catchError((err) => {
          throw new Error(err.error?.message);
        })
      );
  }

  list(params: {}): Observable<PostModel[]> {
    return this.http
      .get<ApiResponse<PostEntity[]>>(environment.apiUrl + '/publications', {...params}).pipe(
        map((response: ApiResponse<PostEntity[]>) => {
          if (response.data === undefined) {
            throw new Error('Données non disponibles');
          }
          let postsLit = response.data.map((post) => this.postMapper.mapFrom(post));
          this.postService.setPostLocally(postsLit);
          return postsLit;
        }),
        catchError((err) => {
          throw new Error(err.error?.message);
        })
      );
  }

  remove(id: number): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(environment.apiUrl + '/publications/'+id).pipe(
        map((response: ApiResponse<boolean>) => {
          this.postService.removePostLocally(id);
          return response.success;
        }),
        catchError((err) => {
          throw new Error(err.error?.message);
        })
      );
  }

}
