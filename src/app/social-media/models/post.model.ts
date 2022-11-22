import {CommentModel} from "../../core/models/comment.model";
export class PostModel{
  id!:number;
  userId!:number;
  title!:string;
  createdDate!:string;
  imageUrl!:string;
  content!:string;
  comments!:CommentModel[];
}
