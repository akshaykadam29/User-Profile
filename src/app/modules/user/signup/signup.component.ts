import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  authStatusSub: Subscription
  isLoading = false;
  signUpForm: FormGroup;
  imagePreview: string = 'https://www.w3schools.com/howto/img_avatar.png';

  constructor(private auth: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl(null,
        { validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl(null,
        { validators: [Validators.required, Validators.email] }),
      contact: new FormControl(null,
        { validators: [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")] }),
      profilePic: new FormControl(this.imagePreview,
        { validators: [Validators.required], asyncValidators: [mimeType] }),
      password: new FormControl(null,
        { validators: [Validators.required, Validators.minLength(6), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')] })
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    // console.log(file);

    // patch image file as a value
    this.signUpForm.patchValue({ profilePic: file });

    this.signUpForm.get('profilePic').updateValueAndValidity();
    // console.log(file);
    // console.log(this.signUpForm)

    // Read file for image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }


  onSignup(){
    if(this.signUpForm.invalid){
      return
    }
    this.isLoading = true;
    // console.log(this.signUpForm.value);
    this.auth.addUser(this.signUpForm.value.name, this.signUpForm.value.email, +this.signUpForm.value.contact, this.signUpForm.value.profilePic, this.signUpForm.value.password);
    // this.isLoading = false;
  }

  ngOnDestroy(){
    // this.authStatusSub.unsubscribe();
  }
}
