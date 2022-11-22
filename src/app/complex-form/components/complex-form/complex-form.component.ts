import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, mapTo, Observable, startWith, tap} from "rxjs";
import {ComplexFormService} from "../../services/complex-form.service";
import {confirmEqualValidator} from "../../validators/confirm-equal.validator";

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit {

  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  contactPreferenceControl!: FormControl;
  emailControl!: FormControl;
  confirmEmailControl!: FormControl;
  emailForm!:FormGroup;
  phoneControl!: FormControl;
  passwordControl!: FormControl;
  confirmPasswordControl!: FormControl;
  loginInfoForm!:FormGroup;

  showEmailControl$!: Observable<boolean>;
  showPhoneControl$!: Observable<boolean>;
  showEmailError$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>;
  loading!: boolean;

  constructor(private formBuilder:FormBuilder, private complexFormService: ComplexFormService) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
  }

  private initMainForm():void{
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceControl,
      email: this.emailForm,
      phone:this.phoneControl,
      loginInfo: this.loginInfoForm
    })
  }

  private initFormControls() {

    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.contactPreferenceControl = this.formBuilder.control('email');
    this.emailControl = this.formBuilder.control('');
    this.confirmEmailControl = this.formBuilder.control('');

    this.emailForm = this.formBuilder.group({
      email: this.emailControl,
      confirm: this.confirmEmailControl
    }, {
      validators: [confirmEqualValidator('email', 'confirm')],
      updateOn:'blur'
    });

    this.phoneControl = this.formBuilder.control('');

    this.passwordControl = this.formBuilder.control('');
    this.confirmPasswordControl = this.formBuilder.control('');

    this.loginInfoForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl
    }, {
      validators: [confirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur'
    });
  }

  private initFormObservables() {
    this.showEmailControl$ = this.contactPreferenceControl.valueChanges.pipe(
      startWith(this.contactPreferenceControl.value),
      map(preference => preference === 'email'),
      tap(showEmailCtrl => this.setEmailValidators(showEmailCtrl))
    );
    this.showPhoneControl$ = this.contactPreferenceControl.valueChanges.pipe(
      startWith(this.contactPreferenceControl.value),
      map(preference => preference === 'phone'),
      tap(showPhoneCtrl => this.setPhoneValidators(showPhoneCtrl))
    );

    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status => status === 'INVALID' &&
        this.emailControl.value &&
        this.confirmEmailControl.value
      )
    );

    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map(status => status === 'INVALID' &&
        this.passwordControl.value &&
        this.confirmPasswordControl.value &&
        this.loginInfoForm.hasError('confirmEqual')
      )
    );
  }

  private setEmailValidators(showEmailCtrl: boolean) {
    if (showEmailCtrl) {
      this.emailControl.addValidators([
        Validators.required,
        Validators.email
      ]);
      this.confirmEmailControl.addValidators([
        Validators.required,
        Validators.email
      ]);
    } else {
      this.emailControl.clearValidators();
      this.confirmEmailControl.clearValidators();
    }
    this.emailControl.updateValueAndValidity();
    this.confirmEmailControl.updateValueAndValidity();
  }

  private setPhoneValidators(showPhoneCtrl: boolean) {
    if (showPhoneCtrl) {
      this.phoneControl.addValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]);
    } else {
      this.phoneControl.clearValidators();
    }
    this.phoneControl.updateValueAndValidity();
  }

  onSubmitForm() {
    this.loading = true;
    this.complexFormService.saveUserInfo(this.mainForm.value).pipe(
      tap(saved =>{
        this.loading = false
        if(saved){
          this.resetForm();
        }else{
          console.log('Echec de l\'enregistrement');
        }
      })
    ).subscribe();
  }

  private resetForm(){
    this.mainForm.reset();
    this.contactPreferenceControl.patchValue('email');
  }

  getFormControlErrorText(ctrl: AbstractControl){
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('email')) {
      return 'Merci d\'entrer une adresse mail valide';
    } else if (ctrl.hasError('minlength')) {
      return 'Ce numéro de téléphone ne contient pas assez de chiffres';
    } else if (ctrl.hasError('maxlength')) {
      return 'Ce numéro de téléphone contient trop de chiffres';
    } else {
      return 'Ce champ contient une erreur';
    }
  }


}
