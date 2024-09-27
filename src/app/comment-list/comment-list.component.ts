import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MentionSuggestionsComponent } from '../mention-suggestions/mention-suggestions.component';
import { CommentListViewComponent } from '../comment-list-view/comment-list-view.component';
import { COMMENT_LIST_CONSTANTS, USER_LIST } from './comment-list.constants';

interface User {
  userID: number;
  name: string;
}

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [ReactiveFormsModule, MentionSuggestionsComponent, CommentListViewComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})
export class CommentListComponent implements OnInit {
  @ViewChild('mentionSuggestions') mentionSuggestions!: MentionSuggestionsComponent;
  @ViewChild('commentTextarea') commentTextarea!: ElementRef<HTMLTextAreaElement>;

  readonly constants = COMMENT_LIST_CONSTANTS;
  comments: string[] = COMMENT_LIST_CONSTANTS.INITIAL_COMMENTS;
  users: User[] = USER_LIST;
  commentForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.commentForm = this.fb.group({
      newComment: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onCommentInput(): void {
    const newComment = this.commentForm.get('newComment')?.value;
    this.mentionSuggestions.checkForMention(newComment);
  }

  onCommentSubmit(): void {
    if (this.commentForm.valid) {
      const newComment = this.commentForm.get('newComment')?.value;
      this.comments.push(newComment.trim());
      this.notifyMentionedUsers(newComment);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.commentForm.reset();
    this.closeSuggestions();
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
    const currentComment = this.commentForm.get('newComment')?.value;
    const newComment = currentComment.replace(/@([a-zA-Z]*)$/, `@${user.name} `);
    this.commentForm.patchValue({ newComment });
    this.commentTextarea.nativeElement.focus();
  }

  closeSuggestions(): void {
    this.mentionSuggestions.showDropdown = false;
  }
}
