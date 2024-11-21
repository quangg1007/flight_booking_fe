import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from "./component/common/side-bar/side-bar.component";

@Component({
  standalone: true,
  imports: [RouterModule, SideBarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'admin';
}
