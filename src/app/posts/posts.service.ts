import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject, from } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({  // instead of importing service in app.module .. we use this injectable features in service file
  providedIn: 'root'
})
export class PostsService {

  constructor(public http: HttpClient, public router: Router) { }

  private posts: Post[] = []; // initiall its empty
  private postUpdated  = new Subject<{posts: Post[], postCount: number}>();


getPosts(postPerPage: number, currentPage: number) {
   // return [...this.posts]; // it is the copy of posts
   const queryParms = `?pagesize=${postPerPage}&page=${currentPage}`;

   this.http
   .get<{message: string , posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParms)
   .pipe(map((postData) => {     // operators-> map
     return { posts: postData.posts.map(post => {
       return { title: post.title, content: post.content, id: post._id, imagePath: post.imagePath  };
     }),
     maxPosts: postData.maxPosts
    };
   }))
   .subscribe((transformedPostData) => {
     this.posts = transformedPostData.posts;

     this.postUpdated.next({
       posts: [...this.posts],
       postCount: transformedPostData.maxPosts
      });
  });
 }


getPostUpdateListner() {
   return this.postUpdated.asObservable();
 }


           // post: Post
addPost(title: string, content: string, image: File) {
  const postData = new FormData();
  postData.append('title', title);
  postData.append('content', content);
  postData.append('image', image , title);

  this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
  .subscribe(responseData => {

  //   const post: Post = {
  //    id: responseData.post.id,
  //    imagePath: responseData.post.imagePath,
  //    title,
  //    content
  //   };
  // // console.log(responseData.message);
  //   this.posts.push(post);
  //   this.postUpdated.next([...this.posts]); // copy of posts
    this.router.navigate(['/']);
  });
}

updatePost(id: string, title: string, content: string, image: File | string) {
   let postData: Post | FormData;

   if (typeof(image) === 'object') {
   postData =  new FormData();
   postData.append('id', id);
   postData.append('title', title);
   postData.append('content', content);
   postData.append('image', image , title); // image and image name sent to the multer filename function

 } else {

    postData = { id , title , content , imagePath: image  };
 }
   this.http
    .put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
    // console.log(response);
    // const updatedPosts = [...this.posts];
    // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
    // const post: Post = { id, title , content, imagePath: ''};
    // updatedPosts[oldPostIndex] = post;
    // this.posts = updatedPosts;
    // this.postUpdated.next([...this.posts]);
    this.router.navigate(['/']);
  });

}


   getPost(id: string) {
 // return {...this.posts.find( p => p.id === id )};
 return this.http.get<{_id: string, title: string, content: string , imagePath: string}>('http://localhost:3000/api/posts/' + id);

}

   deletePost(postId: string) {
    return this.http
    .delete('http://localhost:3000/api/posts/' + postId);

}

}
