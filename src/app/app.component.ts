import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardMatchGameComponent } from './card-match-game/card-match-game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardMatchGameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Card Match';
}
