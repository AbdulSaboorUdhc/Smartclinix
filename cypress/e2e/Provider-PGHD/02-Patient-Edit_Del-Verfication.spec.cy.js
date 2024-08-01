/// <reference types="cypress" />

describe("Verify Patient can't able to edit and delete records after PGHD approval", ()=> {

    before("" , () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.patientUrl)
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.contains("Login").click()
        cy.patientLogin('rrollins', 'Password1@')
        cy.wait(2000)
        cy.contains('Health Record').click()
    })
    
    
    it("Verification of vitals edit and delete actions", () => {
        cy.get("td:nth-child(13)").first().should('not.have.descendants', 'span')
    })

    it("Verification of results edit and delete actions", () => {
        cy.get("a[routerlink='lab-results']").click()
        cy.get(".top-header :nth-child(5)").first().should('not.have.descendants', "div button")
    })

    it("Verification of medications edit and delete actions", () => {
        cy.get("a[routerlink='medications-list']").click()
        cy.get("td:nth-child(5)").first().should('not.have.descendants', 'span')
    })

    it("Verification of allergies edit and delete actions", () => {
        cy.get("a[routerlink='allergies']").click()
        cy.get("td:nth-child(6)").last().should('not.have.descendants', 'span')
    })

    it("Verification of Medical History edit and delete actions", () => {
        cy.get("a[routerlink='past-medical-history']").click()
        cy.get("td:nth-child(5)").first().should('not.have.descendants', 'span')
    })

    it("Verification of Surgical History edit and delete actions", () => {
        cy.get("a[routerlink='past-surgical-history']").click()
        cy.get("td:nth-child(6)").first().should('not.have.descendants', 'span')
    })

    it("Verification of Hospitalization edit and delete actions", () => {
        cy.get("a[routerlink='hospitalizations']").click()
        cy.get("td:nth-child(7)").first().should('not.have.descendants', 'span')
    })

    it("Verification of Family History edit and delete actions", () => {
        cy.get("a[routerlink='family-history']").click()
        cy.get("td[class='condition-cell'] div").first().should('not.have.descendants', 'span')
    })

    it("Verification of Social History edit and delete actions", () => {
        cy.get("a[routerlink='social-history']").click()
        cy.get(".contact-heading .icon").first().should('not.have.descendants', 'span')
    })
})