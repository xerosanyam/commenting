import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})

export class CommentListComponent {
  comments: string[] = [
    'This task was assigned to Daryl',
    'Waiting on Parts',
  ];

  newComment = '';

  onCommentInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newComment = target.value;
  }
  onCommentSubmit(): void {
    this.comments.push(this.newComment);
    this.newComment = '';
  }
}
