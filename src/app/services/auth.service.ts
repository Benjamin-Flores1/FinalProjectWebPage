import { Injectable } from "@angular/core";

import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from '@firebase/app-compat'
//npm i @angular/fire

@Injectable({
    providedIn: 'root'
})

export class AuthService{

    
    constructor (private afauth: AngularFireAuth) {}

    async login(email: string, password: string){
        try{
            return await this.afauth.signInWithEmailAndPassword(email,password);
        }
        catch(error){
            console.log('Error login', error);
            return null;
        }
    }
    async loginWithGoogle(){
        try{
           return await this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        }
        catch(error){
            console.log('Error login google', error);
            return null;
        }
    }
    async register(email: string, password: string){
        try{
            return await this.afauth.createUserWithEmailAndPassword(email,password);
        }
        catch(err){
            console.log('Error register', err);
            return null;
        }
    }
    getUserLogged(){
        return this.afauth.authState;
    }
    logout(){
        return this.afauth.signOut();
    }
}