class PatientRegistrationPage {
    registerButton = '.btn-wrapper > a.btn';
    firstNameField = '#firstName';
    lastNameField = '#lastName';
    dateOfBirthField = 'input[class*="dateTimeField"]';
    genderDropdown = '[formcontrolname="gender"] > .form-control > .p-inputtext';
    phoneField = "#phone";
    emailField = 'input[formcontrolname="email"]';
    userNameField = 'input[formcontrolname="userName"]';
    passwordField = "#password";
    confirmPasswordField = "#confirmPassword";
    registerContinueButton = '.btn.register-continue-btn';
    verificationCodeInput = '.p-inputmask';
    finalizeRegistrationButton = '.col-md-12 > .btn';
  
    clickRegisterButton() {
      cy.get(this.registerButton).click();
    }
  
    fillFirstName(firstName) {
      cy.get(this.firstNameField).type(firstName);
    }
  
    fillLastName(lastName) {
      cy.get(this.lastNameField).type(lastName);
    }
  
    selectDateOfBirth(day, month, year) {
      cy.get(this.dateOfBirthField).click();
      cy.get("[class*='p-datepicker-year']").should('be.visible').select(year.toString());
      cy.get("[class*='p-datepicker-month']").select(month);
      cy.get("[class*='p-datepicker-calendar'] > tbody tr td span").contains(day).click();
    }
  
    selectGender(gender) {
      cy.get(this.genderDropdown).click();
      cy.get(`li[aria-label='${gender}']`).should('be.visible').click();
    }
  
    fillPhoneNumber(phoneNumber) {
      cy.get(this.phoneField).eq(0).type(phoneNumber);
    }
  
    fillEmail(emailAddress) {
      cy.get(this.emailField).type(emailAddress);
    }
  
    fillUserName(userName) {
      cy.get(this.userNameField).type(userName);
    }
  
    fillPassword(password) {
      cy.get(this.passwordField).type(password);
    }
  
    fillConfirmPassword(password) {
      cy.get(this.confirmPasswordField).type(password);
    }
  
    clickRegisterContinueButton() {
      cy.get(this.registerContinueButton).click();
    }
  
    enterVerificationCode(verificationCode) {
      cy.get(this.verificationCodeInput).each(($el) => {
        cy.wrap($el).should('exist').type(verificationCode);
      });
    }
  
    clickFinalizeRegistrationButton() {
      cy.get(this.finalizeRegistrationButton).click();
    }
  }
  
export default PatientRegistrationPage;