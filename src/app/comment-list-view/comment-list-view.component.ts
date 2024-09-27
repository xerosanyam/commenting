import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-list-view',
  standalone: true,
  templateUrl: './comment-list-view.component.html',
  styleUrls: ['./comment-list-view.component.scss']
})
export class CommentListViewComponent {
  @Input() comments: string[] = [];
}