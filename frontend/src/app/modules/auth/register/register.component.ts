import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  RegisterRequest,
  UserRegisterOrUpdateEndpointService
} from '../../../endpoints/auth-endpoints/user-register-or-update-endpoint.service';
import {
  CountryGetAllEndpointService,
  CountryGetAllResponse
} from '../../../endpoints/country-endpoints/country-get-all-endpoint.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css', '../forget-password/forget-password.component.css', './register.component.css']
})
export class RegisterComponent implements OnInit {
  regData : RegisterRequest = {
    iD: null,
    firstName:"",
    lastName:"",
    email:"",
    username:"",
    password:"",
    dateOfBirth:"",
    countryId: 1
  }

  countries : CountryGetAllResponse[] | null = null;

  repeatPassword: string = "";
  errorMessage: string | null = null;
  sentRequest: boolean = false;
  successText: string = "";

  constructor(private cdr: ChangeDetectorRef, private registerService: UserRegisterOrUpdateEndpointService, private countryService: CountryGetAllEndpointService) {

  }

  ngOnInit(): void {
        this.countryService.handleAsync().subscribe((data) => {
          this.countries = data;
        })
  }

  logData(): void {
    console.log(this.regData);
  }

  registerUser() {
    this.registerService.handleAsync(this.regData).subscribe({
      next: (data) => {
        this.sentRequest = true;
        this.successText = data;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error;
        this.cdr.detectChanges();
      }
    })
  }

  checkButton():boolean {
    return !(this.regData.firstName != "" && this.regData.lastName != "" && this.regData.email != null && this.validateEmail() &&
      this.regData.username != "" && this.validateUsername() && this.regData.password != "" && this.validatePassword() && this.validateIfSamePassword());

  }


  validatePassword():boolean {
    let classList = document.getElementById("password")!.classList;
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(this.regData.password)) {
      classList.add("invalid");
      classList.remove("valid");
      this.errorMessage = "Password must be at least 8 characters and contain one small and capital letter, number and special sign (@$!%*?&).";
      return false;
    }
    else {
      classList.add("valid");
      classList.remove("invalid");
      this.errorMessage = null;
      return true;
    }
  }

  validateIfSamePassword() : boolean {
    let classList = document.getElementById("repeatPassword")!.classList;
    if(this.repeatPassword !== this.regData.password)
    {
      classList.add("invalid");
      classList.remove("valid");
      this.errorMessage = "Repeat passwords don't match";
      return false;
    }
    else
    {
      classList.add("valid");
      classList.remove("invalid");
      this.errorMessage = null;
      return true;
    }
  }

  validateEmail():boolean {
    let classList = document.getElementById("email")!.classList;
    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.regData.email)) {
      classList.add("invalid");
      classList.remove("valid");
      this.errorMessage = "Email is invalid!"
      return false;
    }
    else
    {
      classList.add("valid");
      classList.remove("invalid");
      this.errorMessage = null;
      return true;
    }
  }

  validateUsername() {
    let classList = document.getElementById("username")!.classList;
    if(!/^[a-zA-Z0-9.]{3,20}$/.test(this.regData.username)) {
      classList.add("invalid");
      classList.remove("valid");
      this.errorMessage = "Username can can contain small and capital letters and 3-20 characters in length.";
      return false;
    }
    else {
      classList.add("valid");
      classList.remove("invalid");
      this.errorMessage = null;
      return true;
    }
  }

  validateFnLn() {

  }

  validateDOB():boolean {
    let classList = document.getElementById("dateOfBirth")!.classList;

    const d1 = new Date(this.regData.dateOfBirth);
    const d2 = new Date(Date.now());

    // Calculate the difference in years
    let yearsDifference = d2.getFullYear() - d1.getFullYear();

    // Adjust if the current date is earlier in the year than the comparison date
    if (
      d2.getMonth() < d1.getMonth() ||
      (d2.getMonth() === d1.getMonth() && d2.getDate() < d1.getDate())
    ) {
      yearsDifference--;
    }
    if(yearsDifference < 13)
    {
      classList.add("invalid");
      classList.remove("valid");
      this.errorMessage = "You must be at least 13 years old to use 808 Music";
      return false;
    }
    else {
      classList.add("valid");
      classList.remove("invalid");
      this.errorMessage = null;
      return true;
    }

  }
}
