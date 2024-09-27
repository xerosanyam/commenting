import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MentionSuggestionsComponent } from '../mention-suggestions/mention-suggestions.component';
import { CommentListViewComponent } from '../comment-list-view/comment-list-view.component';

interface User {
  userID: number;
  name: string;
}

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [FormsModule, MentionSuggestionsComponent, CommentListViewComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})

export class CommentListComponent {
  @ViewChild('mentionSuggestions') mentionSuggestions!: MentionSuggestionsComponent;
  @ViewChild('commentTextarea') commentTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('commentForm') commentForm!: NgForm;

  comments: string[] = [
    'This task was assigned to Daryl',
    'Waiting on Parts',
  ];

  newComment = '';

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

  onCommentInput(): void {
    this.mentionSuggestions.checkForMention(this.newComment);
  }

  onCommentSubmit(): void {
    if (this.commentForm.form.valid) {
      this.comments.push(this.newComment.trim());
      this.notifyMentionedUsers(this.newComment);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newComment = '';
    this.commentForm.resetForm();
  }

  private extractMentionedUsers(comment: string): User[] {
    const mentionRegex = /@(\w+)/g;
    const mentions = comment.match(mentionRegex) || [];
    return mentions
      .map(mention => mention.substring(1))
      .map(name => this.users.find(user => user.name.toLowerCase() === name.toLowerCase()))
      .filter((user): user is User => user !== undefined);
  }

  notifyMentionedUsers(comment: string): void {
    const mentionedUsers = this.extractMentionedUsers(comment);
    mentionedUsers.forEach(user => {
      console.log(`Notifying user: ${user.name} (ID: ${user.userID})`);
      // Implement actual notification logic here
    });
  }

  handleSuggestionSelected(user: User): void {
    this.newComment = this.newComment.replace(/@([a-zA-Z]*)$/, `@${user.name} `);
    this.commentTextarea.nativeElement.focus();
  }
}
