import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMatchGameComponent } from './card-match-game.component';

describe('CardMatchGameComponent', () => {
  let component: CardMatchGameComponent;
  let fixture: ComponentFixture<CardMatchGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMatchGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMatchGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
