class UserCredentialsCreation {
    usernameInput = "input[type='text']";
    passwordInput = "input[class*='p-password-input']:eq(0)";
    confirmPasswordInput = "input[class*='p-password-input']:eq(1)";
    createCredentialsButton = "button[class$=btn-blue]";

    createUserCredentials(lastName, password) {
        cy.get(this.usernameInput).type(lastName);
        cy.get(this.passwordInput).type(password);
        cy.get(this.confirmPasswordInput).type(password);
        cy.wait(3000);
        cy.get(this.createCredentialsButton).click();
      }
}

export default UserCredentialsCreation;