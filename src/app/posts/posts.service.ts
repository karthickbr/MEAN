import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject, from } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Injectable({  // instead of importing service in app.module .. we use this injectable features in service file
  providedIn: 'root'
})
export class PostsService {

  constructor(public http: HttpClient) { }

  private posts: Post[] = []; // initiall its empty
  private postUpdated  = new Subject<Post[]>();

 getPosts() {
   // return [...this.posts]; // it is the copy of posts
   this.http.get<{message: string , posts: Post[]}>('http://localhost:3000/api/posts')
   .subscribe((postData) => {
     this.posts = postData.posts;
     this.postUpdated.next([...this.posts]);
  });
 }

 getPostUpdateListner() {
   return this.postUpdated.asObservable();
 }
           // post: Post
 addPost(title: string, content: string) {
  const post: Post = {id: null, title, content};
  this.posts.push(post);
  this.postUpdated.next([...this.posts]); // copy of posts
}

}
