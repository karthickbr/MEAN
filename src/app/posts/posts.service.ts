import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject, from } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({  // instead of importing service in app.module .. we use this injectable features in service file
  providedIn: 'root'
})
export class PostsService {

  constructor(public http: HttpClient) { }

  private posts: Post[] = []; // initiall its empty
  private postUpdated  = new Subject<Post[]>();



 getPosts() {
   // return [...this.posts]; // it is the copy of posts
   this.http
   .get<{message: string , posts: any}>('http://localhost:3000/api/posts'

   )
   .pipe(map((postData) => {     // operators-> map
     return postData.posts.map(post => {
       return {
         title: post.title,
         content: post.content,
         id: post._id
       };
     });
   }))
   .subscribe((transformedPost) => {
     this.posts = transformedPost;
     this.postUpdated.next([...this.posts]);
  });
 }



 getPostUpdateListner() {
   return this.postUpdated.asObservable();
 }



           // post: Post
 addPost(title: string, content: string) {
  const post: Post = {id: null, title, content};
  this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
  .subscribe(responseData => {
  console.log(responseData.message);
  const id = responseData.postId;
  post.id = id;
  this.posts.push(post);
  this.postUpdated.next([...this.posts]); // copy of posts
  });
}

 deletePost(postId: string) {
  this.http.delete('http://localhost:3000/api/posts/' + postId)
  .subscribe(() => {
    console.log('Deleted !');
    const updatedPosts = this.posts.filter(post => post.id !== postId);
    this.posts = updatedPosts;
    this.postUpdated.next([...this.posts]);

  });
}

}
