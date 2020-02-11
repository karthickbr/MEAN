import { Component, OnInit } from '@angular/core';
import {Post} from '../../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {PostsService} from '../../posts.service';
import { from } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

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
  imagePreview: string;
  post: Post;
  form: FormGroup;
  isLoading = false;
  reader: any;


  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {

      this.form = new FormGroup({

        title: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(4)]
        }),

        content: new FormControl(null, {
          validators: [Validators.required]
        }),

        image: new FormControl(null, {
          validators: [Validators.required], asyncValidators: [mimeType]
        })

      });

      this.route.paramMap.subscribe((paramMap: ParamMap) => { // it is an observable  no need to unsubscribe

        if (paramMap.has('postId')) { // getting from the app-routing module

            this.mode = 'edit';
            this.postId = paramMap.get('postId');
            this.isLoading = true;
            this.postsService.getPost(this.postId).subscribe(postData => {
            this.post = {
              id: postData._id,
              title: postData.title ,
              content: postData.content,
              imagePath: postData.imagePath
            };
            this.isLoading = false;
            this.form.setValue({
                                title: this.post.title,
                                content: this.post.content,
                                image: this.post.imagePath
                              });

            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onImagePicked(event: Event) {

       const file = (event.target as HTMLInputElement).files[0];
       this.form.patchValue({ image: file });
       this.form.get('image').updateValueAndValidity();
      //  console.log(this.form);
     //  console.log(file);

       this.reader = new FileReader();
       this.reader.onload = () => {
       this.imagePreview = this.reader.result;
      };
       this.reader.readAsDataURL(file);
  }


onSavePost() {

  if (this.form.invalid) {
    return;
  }
  this.isLoading = true;

  if (this.mode === 'create') {

    this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    this.isLoading = true;
  } else {
    this.postsService.updatePost(
      this.postId,
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
      );

  }

  this.form.reset();

}

}
