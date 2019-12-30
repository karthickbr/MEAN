import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({  // instead of importing service in app.module .. we use this injectable features in service file
  providedIn: 'root'
})
export class PostsService {

  constructor() { }
  private posts: Post[] = []; // initiall its empty
  private postUpdated  = new Subject<Post[]>();

 getPosts() {
   return [...this.posts]; // it is the copy of posts
 }

 getPostUpdateListner() {
   return this.postUpdated.asObservable();
 }
           // post: Post
addPost(title: string, content: string) {
  const post: Post = {title, content};
  this.posts.push(post);
  this.postUpdated.next([...this.posts]);
}

}
