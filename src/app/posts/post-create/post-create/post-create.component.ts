import { Component, OnInit } from '@angular/core';
import {Post} from '../../post.model';
import { NgForm } from '@angular/forms';
import {PostsService} from '../../posts.service';
import { from } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '' ;
  // postCreated = new EventEmitter<Post>();
  mode = 'create';
  private postId: string;
  post: Post;


  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => { // it is an observable  no need to unsubscribe

        if (paramMap.has('postId')) { // getting from the app-routing module
            this.mode = 'edit';
            this.postId = paramMap.get('postId');
            this.post = this.postsService.getPost(this.postId);
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

onSavePost(form: NgForm) {

  if (form.invalid) {
    return;
  }
  // const post: Post = {
  //     title : form.value.title,
  //     content: form.value.content
  //   };
  // this.postCreated.emit(post);
  if (this.mode === 'create') {

    this.postsService.addPost(form.value.title, form.value.content);
  } else {

    this.postsService.updatePost(this.postId, form.value.title, form.value.content);

  }

  form.resetForm();
  // alert('Post Added');
}

}
