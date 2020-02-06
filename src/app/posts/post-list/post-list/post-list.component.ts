import { Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';

import {Post} from 'src/app/posts/post.model';
import {PostsService} from 'src/app/posts/posts.service';



@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy {

  isLoading = false;
  totalPosts = 10;
  postPerPage = 2;
  pageSizeOptions = [2, 5, 10];
  constructor(public postsService: PostsService) { }

  // posts = [
  //   {title: 'The first post', content: 'The is the first post'},
  //   {title: 'The second post', content: 'The is the second post'},
  //   {title: 'The third post', content: 'The is the third post'}
  //   ];

  posts: Post [] = [];
  private postsSub: Subscription;

  ngOnInit() {
    // this.posts = this.postsService.getPosts();
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub =  this.postsService.getPostUpdateListner()
    .subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
   }

   onChangedPage(pageData: PageEvent) {
    console.log(pageData);
   }

   onDelete(postId: string) {
     this.postsService.deletePost(postId);
   }

   ngOnDestroy() {
    this.postsSub.unsubscribe();
   }

}
