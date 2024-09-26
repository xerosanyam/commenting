import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionSuggestionsComponent } from './mention-suggestions.component';

describe('MentionSuggestionsComponent', () => {
  let component: MentionSuggestionsComponent;
  let fixture: ComponentFixture<MentionSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionSuggestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentionSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
