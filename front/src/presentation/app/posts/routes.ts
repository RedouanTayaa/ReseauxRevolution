import { Route } from '@angular/router';
import { PostsListComponent } from '@presentationPosts/posts-list/posts-list.component';

export default [
  {path: 'list', component: PostsListComponent},
  {path: '**', redirectTo: 'list'},
] as Route[];
