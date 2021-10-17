import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  isLoading = false;
  authStatusSub: Subscription

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.auth.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
  }

  onLogin(form: NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.auth.loginUser(form.value.email, form.value.password);
    form.resetForm();
    // this.isLoading = false;
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
