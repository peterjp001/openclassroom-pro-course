import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PostModel} from "../../models/post.model";

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent implements OnInit {

  @Input() post!:PostModel;
  @Output() postCommented = new EventEmitter<{ comment: string, postId: number }>();

  tempUser = {firstName:'Peter', lastName:'Jp'};

  constructor() { }

  ngOnInit(): void {
  }

  onNewComment(comment: string) {
    this.postCommented.emit({ comment, postId: this.post.id });
  }
}
