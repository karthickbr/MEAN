import { Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';

import {Post} from 'src/app/posts/post.model';
import {PostsService} from 'src/app/posts/posts.service';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy {

  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(public postsService: PostsService, private authService: AuthService) { }

  // posts = [
  //   {title: 'The first post', content: 'The is the first post'},
  //   {title: 'The second post', content: 'The is the second post'},
  //   {title: 'The third post', content: 'The is the third post'}
  //   ];

  posts: Post [] = [];
  userIsAuthenticated = false;
  userId: string;

  private postsSub: Subscription;
  private authStatusSub: Subscription;

  ngOnInit() {
    // this.posts = this.postsService.getPosts();
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub =  this.postsService
    .getPostUpdateListner()
    .subscribe((postData: { posts: Post[], postCount: number}) => {   // postCount value from postservice file ... shoulsd be the same name
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAutheticated => {
      this.userIsAuthenticated = isAutheticated;
      this.userId = this.authService.getUserId();
    });
   }

   onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1 ;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
   }

   onDelete(postId: string) {
       this.isLoading = true;
       this.postsService.deletePost(postId).subscribe(() => {
       this.postsService.getPosts(this.postPerPage, this.currentPage );
     });
   }

   ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
   }

}
