import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';

interface Card {
  id: string;
  value: string;
  image: string;
  previouslyFlipped: boolean;
  flipped: boolean;
  paired: boolean;
}

const shuffleArray = (array: Card[]): Card[] => {
  return array
    .map((value, index) => [Math.random(), index])
    .sort((a, b) => a[0] - b[0])
    .map(([_, index]) => array[index]);
};

@Component({
  selector: 'app-card-match-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-match-game.component.html',
  styleUrls: ['./card-match-game.component.css'],
})
export class CardMatchGameComponent implements OnInit {
  private solvedPairs = 0;
  private checkingMatch = false;
  private timer = 0;

  public cards: Card[] = [];
  public intervalId: any;
  public displayTimer = '0:00';
  public gameOver = false;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.cards = this.generateCards();
    this.startTimer();
  }

  startTimer = (): void => {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.timer++;
          const minutes = Math.floor(this.timer / 60);
          const remainingSeconds = this.timer % 60;
          this.displayTimer = `${minutes}:${
            remainingSeconds < 10 ? '0' : ''
          }${remainingSeconds}`;
        });
      }, 1000);
    });
  };

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  generateCards(): Card[] {
    const cardNumber = Array.from({ length: 9 }, (_, i) => i + 1);
    return shuffleArray(
      cardNumber.flatMap((cardNumber) => [
        ...this.createCards(cardNumber, 'hearts'),
        ...this.createCards(cardNumber, 'spades'),
      ])
    );
  }

  createCards = (cardNumber: number, suit: string): Card[] => {
    return [0, 1].map((index) => {
      const id = `${cardNumber}_${suit}_${index}`;
      const value = `${cardNumber}_${suit}`;
      return {
        id,
        value,
        image: `/assets/images/${
          cardNumber === 1 ? 'ace' : cardNumber
        }_of_${suit}.png`,
        previouslyFlipped: false,
        flipped: false,
        paired: false,
      };
    });
  };

  public flipCard = (id: any): void => {
    const card = this.cards.find((card) => card.id === id);

    if (!card || card.flipped || this.checkingMatch) {
      return;
    }

    card.flipped = true;
    card.previouslyFlipped = true;

    this.checkMatch();
  };

  public checkMatch = async (): Promise<void> => {
    const flippedCards = this.cards.filter(
      (card) => card.flipped && !card.paired
    );

    if (flippedCards.length === 2) {
      this.checkingMatch = true;

      const [card1, card2] = flippedCards;
      if (card1.value === card2.value) {
        this.solvedPairs++;
        card1.paired = true;
        card2.paired = true;

        if (this.solvedPairs === 18) {
          clearInterval(this.intervalId);
          this.gameOver = true;
        }
      } else {
        this.timer += 5;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        card1.flipped = false;
        card2.flipped = false;
      }

      this.checkingMatch = false;
    }
  };

  public restartGame = (): void => {
    this.cards = this.generateCards();
    this.solvedPairs = 0;
    this.timer = 0;
    this.displayTimer = '0:00';
    this.gameOver = false;
    this.startTimer();
  };
}
