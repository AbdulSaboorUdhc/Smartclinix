class ProviderCreationPage {
    createProviderUserButton = ".merge-sty button";
    firstNameInput = "input[placeholder='First Name here...']";
    lastNameInput = "input[placeholder='Last Name here...']";
    emailInput = "input[placeholder='Email Address here...']";
    genderDropdown = "[formcontrolname=gender] span[class*=p-dropdown-trigger-icon]";
    userRoleDropdown = "[formcontrolname=userRole] span[class*=p-dropdown-trigger-icon]";
    providerRole = "li[aria-label='Provider']";
    clickTaxonomyField = "#p-accordiontab-3 > .p-accordion-toggle-icon";
    searchTaxonomyInput = "input[placeholder='Search Taxonomy']";
    selectTaxonomyValue =  ".p-autocomplete-panel > ul > li > span";
    submitButton = "button[type='submit']";

    clickCreateProviderButton() {
        cy.get(this.createProviderUserButton).click();
    }
    
    fillFirstName(firstName) {
        cy.get(this.firstNameInput).type(firstName);
    }

    fillLastName(lastName) {
        cy.get(this.lastNameInput).type(lastName);
    }

    fillEmail(email) {
        cy.get(this.emailInput).type(email);
    }

    selectGender(gender) {
        cy.get(this.genderDropdown).click();
        cy.get(`li[aria-label='${gender}']`).should('be.visible').click();
    }

    selectUserRole(role) {
        cy.get(this.userRoleDropdown).click();
        cy.get(`li[aria-label='${role}']`).should('be.visible').click();
    }

    addTaxonomy(search, value) {
        cy.get(this.clickTaxonomyField).click()
        cy.get(this.searchTaxonomyInput).type(search);
        cy.get(this.selectTaxonomyValue).each( $el => {
           if($el.text() === value ) {
            cy.wrap($el).click() 
          }
        })
    }

    submitForm() {
        cy.get(this.submitButton).click();
    }

}

export default ProviderCreationPage;