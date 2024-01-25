import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  SmplIdentityClientService
} from "../../../smplecosystem/smpl-identity-client/src/lib/smpl-identity-client.service";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'showcase';

  constructor(
    private smplIdentityClientService: SmplIdentityClientService,
  ) {}

  async ngOnInit() {
      await this.smplIdentityClientService.broadcastTransaction('cosmos1ph09ga9nvef89e8en7pr9xejvpk5wgmqzgu8u9');
  }
}
