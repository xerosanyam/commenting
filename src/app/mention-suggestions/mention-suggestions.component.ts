import { Component, EventEmitter, Output, Input, HostListener } from '@angular/core';

interface User {
  userID: number;
  name: string;
}

@Component({
  selector: 'app-mention-suggestions',
  standalone: true,
  templateUrl: './mention-suggestions.component.html',
  styleUrls: ['./mention-suggestions.component.scss']
})
export class MentionSuggestionsComponent {
  @Input() title = 'Suggestions';
  @Input() suggestions: User[] = [];
  @Output() suggestionSelected = new EventEmitter<User>();

  filteredSuggestions: User[] = [];
  showDropdown = false;
  mentionRegex = /@([a-zA-Z]*)$/;
  selectedIndex = -1;
  mention = '';
  numberOfSuggestions = 4;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showDropdown) {
      switch (event.key) {
        case 'ArrowDown':
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredSuggestions.length - 1);
          event.preventDefault();
          break;
        case 'ArrowUp':
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
          event.preventDefault();
          break;
        case 'Enter':
          if (this.selectedIndex >= 0) {
            this.selectSuggestion(this.filteredSuggestions[this.selectedIndex]);
            event.preventDefault();
          }
          break;
        case 'Escape':
          this.showDropdown = false;
          this.selectedIndex = -1;
          event.preventDefault();
          break;
      }
    }
  }

  checkForMention(text: string): void {
    const match = text.match(this.mentionRegex);
    if (match) {
      const typedName = match[1].toLowerCase();
      this.filteredSuggestions = this.suggestions.filter(suggestion =>
        suggestion.name.toLowerCase().startsWith(typedName)
      ).slice(0, this.numberOfSuggestions);
      this.showDropdown = true
      this.selectedIndex = 0;
      this.mention = match[1];
    } else {
      this.showDropdown = false;
      this.selectedIndex = -1;
    }
  }

  selectSuggestion(suggestion: User): void {
    this.suggestionSelected.emit(suggestion);
    this.showDropdown = false;
    this.selectedIndex = -1;
  }
}
