import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {PostModel} from "../models/post.model";
import {PostsService} from "../services/posts.service";
import {Observable} from "rxjs";

@Injectable()

export  class PostsResolver implements Resolve<PostModel[]>{

  constructor(private postService:PostsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostModel[]>{
    return this.postService.getPosts();
  }
}
