import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthLoginEndpointService} from '../../../endpoints/auth-endpoints/auth-login-endpoint.service';
import {AlbumInsertRequest} from '../../../endpoints/album-endpoints/album-insert-or-update-endpoint.service';
import {
  LoginRequest,
  UserAuthLoginEndpointService
} from '../../../endpoints/auth-endpoints/user-auth-login-endpoint.service';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginRequest: LoginRequest = {username: 'admin', password: 'admin123', rememberMe: false};
  errorMessage: string | null = null;

  constructor(private authLoginService: UserAuthLoginEndpointService,
              private router: Router,
              private auth: MyUserAuthService) {
  }

  ngOnInit(): void {
    if(this.auth.isLoggedIn())
    {
      alert("Already logged in.")
      this.router.navigate(['/artist/album']);
    }
  }

  onLogin(): void {
    this.authLoginService.handleAsync(this.loginRequest).subscribe({
      next: (lr) => {
        console.log('Login successful');
        console.log(lr)
        // Redirect to
        this.router.navigate(['/artist']);
      },
      error: (error: any) => {
        this.errorMessage = 'Incorrect username or password';
        console.error('Login error:', error);
      }
    });
  }

  LogData(): void {
    alert(this.loginRequest.username);
    alert(this.loginRequest.password);
    alert(this.loginRequest.rememberMe);
  }
}
