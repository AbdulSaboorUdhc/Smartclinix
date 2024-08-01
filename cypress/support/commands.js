// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('providerLogin', (email, password) => { 
    cy.get("#Username").type(email)
    cy.get("#Password").type(password)
    cy.get(".btn-login").click()    
 })
 

 Cypress.Commands.add('patientLogin', (username, password) => {
    cy.get('#Username').type(username)
    cy.get('#Password').type(password)
    cy.get("button[value='login']").click()
 })


//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

