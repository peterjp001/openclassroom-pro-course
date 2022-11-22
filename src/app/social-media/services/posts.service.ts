import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostModel} from "../models/post.model";
import {environment} from "../../../environments/environment";

@Injectable()

export class PostsService{

  constructor(private http:HttpClient) {  }

  getPosts():Observable<PostModel[]>{
    return this.http.get<PostModel[]>(`${environment.apiUrl}/posts`);
  }

  addNewComment(postCommented: { comment: string, postId: number }) {
    console.log(postCommented);
  }
}
