import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionSuggestionsComponent } from '../mention-suggestions/mention-suggestions.component';

interface User {
  userID: number;
  name: string;
}

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [FormsModule, MentionSuggestionsComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})

export class CommentListComponent {
  @ViewChild('mentionSuggestions') mentionSuggestions!: MentionSuggestionsComponent;
  @ViewChild('commentTextarea') commentTextarea!: ElementRef<HTMLTextAreaElement>;

  comments: string[] = [
    'This task was assigned to Daryl',
    'Waiting on Parts',
  ];

  newComment = '';

  onCommentInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.newComment = target.value;
    this.mentionSuggestions.checkForMention(this.newComment);
  }

  onCommentSubmit(): void {
    if (this.newComment.trim()) {
      this.comments.push(this.newComment.trim());
      this.newComment = '';
    }
  }

  users: User[] = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
    { userID: 5, name: 'Daryl' },
    { userID: 6, name: 'Kyle' },
    { userID: 7, name: 'Jen' },
    { userID: 8, name: 'Megan' },
    { userID: 9, name: 'Kevin' }
  ];

  handleSuggestionSelected(user: User): void {
    this.newComment = this.newComment.replace(/@([a-zA-Z]*)$/, `@${user.name} `);
    this.commentTextarea.nativeElement.focus();
  }
}
