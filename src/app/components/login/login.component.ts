import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  error: any
  userlogged: boolean = false;
  Form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(public authService: AuthService,private router : Router) { }

  ngOnInit(): void {
    this.userlogged=false
    this.error=false
    this.authService.getUserLogged().subscribe(
      response => {
        console.log(response);
        if (response){
          console.log("Esta logueado")
        }else{
          console.log("No esta logueado")
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  login(){
    this.authService.login(
      this.Form.get('username')?.value || '',
      this.Form.get('password')?.value || '',
    ).then(
      response => {
        console.log(response);
        localStorage.setItem('Usuario', JSON.stringify(response))
        if (response){
          this.router.navigateByUrl('/proveedor');
        }else{
          console.log("Error")
          this.error=true
        }
      },
      
    )
  }

  loginGoogle(){
    this.authService.loginWithGoogle().then(
      response => {
        console.log(response);
        localStorage.setItem('Usuario', JSON.stringify(response))
        if (response){
          this.router.navigateByUrl('/dash');
        }else{
          console.log("Error")
          this.error=true
        }
      }
    )
  }

  register(): void{
    this.authService.register(
      this.Form.get('username')?.value || '',
      this.Form.get('password')?.value || '',
    ).then(
      response => {
        console.log('Registered | ',response);
      }
    )
  }
  showUserData(){
    this.authService.getUserLogged().subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    )
  }

  get userData(){
    return 'User: '+ this.Form.get('username')?.value +' | Password: ' + this.Form.get('password')?.value
  }

  logOut(){
    this.authService.logout()
    console.log("Logged out")
  }


}

