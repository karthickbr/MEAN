import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListnerSubs: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit() {

    this.authListnerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
     this.authListnerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
