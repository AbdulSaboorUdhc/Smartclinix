/// <reference types="cypress" />

describe("Verify Provider should be able to edit and delete records after PGHD approval", ()=> {
    before("", () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.providerUrl)
        }) 
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.providerLogin("cmpunk", "Password1@")
        cy.wait(2000)
        cy.get("a[routerlink='patients/list']").click()
        cy.get(".search-user-control input[placeholder='Search Patients..']").eq(0).type('roman')
        cy.get(".patient-name-link").contains('Roman Rollins').should("be.visible")
        cy.get(".p-datatable-tbody .patient-name-cell .patient-name-link").each($el => {
            const nameText = $el.text().trim()
              if (nameText.includes('Roman Rollins')) {
                cy.wrap($el).click({force:true})
              }     
        }) 
        cy.wait(3000)
    })

    it("Verification of vitals edit and delete actions", () => {
        cy.get('a span').contains("Vitals").click()
        cy.get("td:nth-child(13)").first().should('have.descendants', 'span')
    })

    it("Verification of results edit and delete actions", () => {
        cy.get('a span').contains("Results").click()
        cy.get(".top-header :nth-child(5)").first().should('have.descendants', "div button")
    })

    it('Verification of medications edit and delete actions', () => {
        cy.get('a').contains("Medications List").click()
        cy.get("td:nth-child(6)").first().should('have.descendants', 'span')
    })

    it('Verification of allergies edit and delete actions', () => {
        cy.get('a').contains("Allergies").click()
        cy.get("td:nth-child(6)").first().should('have.descendants', 'span')
        cy.wait(3000)
    })

    it("Verification of Medical History edit and delete actionsy", () => {
        cy.get('a span').contains("Histories").click()
        cy.get("td:nth-child(5)").first().should('have.descendants', 'span')
    })

    it("Verification of Surgical History edit and delete actions", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Surgical History').click()
        cy.get("td:nth-child(6)").first().should('have.descendants', 'span')
    })

    it("Verification of Hospitalization edit and delete actions", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Hospitalization History').click()
        cy.get("td:nth-child(7)").first().should('have.descendants', 'span')
    })

    it("Verification of Family History edit and delete actions", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Family History').click()
        cy.get("td[class='condition-cell'] div").first().should('have.descendants', 'span')
    })

    it("Verification of Social History edit and delete actions", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Social History').click()
        cy.get(".contact-heading .icon").first().should('have.descendants', 'span')
    })

})