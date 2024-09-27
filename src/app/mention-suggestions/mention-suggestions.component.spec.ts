import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentionSuggestionsComponent } from './mention-suggestions.component';
import { By } from '@angular/platform-browser';

describe('MentionSuggestionsComponent', () => {
  let component: MentionSuggestionsComponent;
  let fixture: ComponentFixture<MentionSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionSuggestionsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MentionSuggestionsComponent);
    component = fixture.componentInstance;
    component.suggestions = [
      { userID: 1, name: 'Alice' },
      { userID: 2, name: 'Bob' },
      { userID: 3, name: 'Charlie' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show dropdown initially', () => {
    expect(component.showDropdown).toBeFalse();
    const dropdown = fixture.debugElement.query(By.css('.mention-suggestions'));
    expect(dropdown).toBeNull();
  });

  it('should show dropdown with filtered suggestions when checkForMention is called with a valid mention', () => {
    component.checkForMention('Hello @A');
    fixture.detectChanges();

    expect(component.showDropdown).toBeTrue();
    expect(component.filteredSuggestions.length).toBe(1);
    expect(component.filteredSuggestions[0].name).toBe('Alice');

    const dropdown = fixture.debugElement.query(By.css('.mention-suggestions'));
    expect(dropdown).toBeTruthy();
  });

  it('should not show dropdown when checkForMention is called without a mention', () => {
    component.checkForMention('Hello world');
    fixture.detectChanges();

    expect(component.showDropdown).toBeFalse();
    const dropdown = fixture.debugElement.query(By.css('.mention-suggestions'));
    expect(dropdown).toBeNull();
  });

  it('should emit selected suggestion when selectSuggestion is called', () => {
    const selectedUser = { userID: 1, name: 'Alice' };
    spyOn(component.suggestionSelected, 'emit');

    component.selectSuggestion(selectedUser);

    expect(component.suggestionSelected.emit).toHaveBeenCalledWith(selectedUser);
    expect(component.showDropdown).toBeFalse();
  });

  it('should handle keyboard navigation', () => {
    component.checkForMention('Hello @A');
    fixture.detectChanges();

    // Test arrow down
    component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(component.selectedIndex).toBe(0);

    // Test arrow up
    component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(component.selectedIndex).toBe(-1);

    // Test enter key
    spyOn(component, 'selectSuggestion');
    component.selectedIndex = 0;
    component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component.selectSuggestion).toHaveBeenCalledWith(component.filteredSuggestions[0]);

    // Test escape key
    component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.showDropdown).toBeFalse();
  });

  it('should show loading state', () => {
    component.isLoading = true;
    component.showDropdown = true;
    fixture.detectChanges();

    const loadingState = fixture.debugElement.query(By.css('.loading-state'));
    expect(loadingState).toBeTruthy();
  });

  it('should show error message', () => {
    component.errorMessage = 'An error occurred';
    component.showDropdown = true;
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('An error occurred');
  });

  it('should show no suggestions message when there are no matches', () => {
    component.checkForMention('Hello @Z');
    fixture.detectChanges();

    const noSuggestions = fixture.debugElement.query(By.css('.no-suggestions'));
    expect(noSuggestions).toBeTruthy();
    expect(noSuggestions.nativeElement.textContent).toContain('No matching users found');
  });
});
