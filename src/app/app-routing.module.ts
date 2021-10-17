import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';

import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: 'myProfile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/myProfile', pathMatch: 'full' },
  { path: 'edit/:id', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./modules/user/user.module').then(m =>  m.UserModule ) },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
