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

  get isCommentValid(): boolean {
    return this.newComment.trim().length > 0;
  }

  onCommentInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.newComment = target.value;
    this.mentionSuggestions.checkForMention(this.newComment);
  }

  onCommentSubmit(): void {
    if (this.isCommentValid) {
      this.comments.push(this.newComment.trim());
      const mentionedUsers = this.extractMentionedUsers(this.newComment);
      this.notifyMentionedUsers(mentionedUsers);
      this.newComment = '';
    }
  }

  extractMentionedUsers(comment: string): User[] {
    const mentionRegex = /@(\w+)/g;
    const mentions = comment.match(mentionRegex) || [];
    return mentions
      .map(mention => mention.substring(1)) // Remove '@' symbol
      .map(name => this.users.find(user => user.name.toLowerCase() === name.toLowerCase()))
      .filter((user): user is User => user !== undefined);
  }

  notifyMentionedUsers(users: User[]): void {
    users.forEach(user => {
      console.log(`Notifying user: ${user.name} (ID: ${user.userID})`);
      // Here you would implement the actual notification logic,
      // such as sending an API request or triggering a notification service
    });
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
