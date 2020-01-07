import { Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from 'src/app/posts/post.model';
import {PostsService} from 'src/app/posts/posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy {

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
    this.postsService.getPosts();
    this.postsSub =  this.postsService.getPostUpdateListner()
   .subscribe((posts: Post[]) => {
      this.posts = posts;
    });
   }

   onDelete(postId: string) {
     this.postsService.deletePost(postId);
   }

   ngOnDestroy() {
    this.postsSub.unsubscribe();
   }

}
