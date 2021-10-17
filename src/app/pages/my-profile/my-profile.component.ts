import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  userId: string;
  isProfile = false;
  name: string;
  email: string;
  contact: string;
  profilePic: string;

  constructor(private route: ActivatedRoute, private auth: AuthService) { }

  ngOnInit(): void {
    this.userId = this.auth.getUserId();
    // console.log(this.userId);
    this.auth.getUserProfile(this.userId).subscribe(response => {
      if(response){
        this.isProfile = true;
      }
      // console.log(response.profileData);
      this.name = response.profileData.name;
      this.email = response.profileData.email;
      this.contact = response.profileData.contact;
      this.profilePic = response.profileData.profilePicPath;
    });;


  }

}
