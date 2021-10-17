import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  editForm: FormGroup;
  userId: string;
  imagePreview: string = 'https://www.w3schools.com/howto/img_avatar.png';

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl(null,
        { validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl(null,
        { validators: [Validators.required, Validators.email] }),
      contact: new FormControl(null,
        { validators: [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")] }),
      profilePic: new FormControl(this.imagePreview,
        { validators: [Validators.required], asyncValidators: [mimeType] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = paramMap.get('id');
      this.authService.getUserProfile(this.userId)
        .subscribe(response => {
          this.imagePreview = response.profileData.profilePicPath;
          this.editForm.setValue({
            name: response.profileData.name,
            email: response.profileData.email,
            contact: response.profileData.contact,
            profilePic: this.imagePreview
          });
          // console.log(this.editForm.value.profilePic);

        })
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    // console.log(file);

    // patch image file as a value
    this.editForm.patchValue({ profilePic: file });

    this.editForm.get('profilePic').updateValueAndValidity();
    // console.log(file);
    // console.log(this.signUpForm)

    // Read file for image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onEditProfile(){
    this.authService.updateUser(this.userId, this.editForm.value.name, this.editForm.value.email, this.editForm.value.contact, this.editForm.value.profilePic);
  }

}
