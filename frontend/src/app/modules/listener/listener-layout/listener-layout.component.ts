import {Component, OnInit} from '@angular/core';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-listener-layout',
  templateUrl: './listener-layout.component.html',
  styleUrl: './listener-layout.component.css'
})
export class ListenerLayoutComponent implements OnInit {
  constructor(private auth: MyUserAuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    if(!this.auth.isLoggedIn())
    {
      this.router.navigate(['/auth/login']);
    }
  }


}
