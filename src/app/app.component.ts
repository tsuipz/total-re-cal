import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckInReminderComponent } from './shared/components/check-in-reminder/check-in-reminder.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CheckInReminderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'total-re-cal';
}
