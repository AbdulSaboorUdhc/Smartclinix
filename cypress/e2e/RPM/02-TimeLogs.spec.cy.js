/// <reference types ="cypress" />

describe("Time Logs for patient in RPM", () => {

    before("", () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.providerUrl)
        }) 
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.providerLogin("cmpunk", "Password1@")
        cy.get("a[routerlink='/rpm']").click()
        cy.get("ul li:nth-child(2) .p-tabview-nav-link").click()
    })

    it("Add timelogs for a patient", () => {
        cy.get("[datakey='rpmEnrollmentId'] tbody tr td:last-child span:nth-child(3)").first().click({force:true})
        cy.get("[role='dialog'] .p-inputnumber-input").type('15')
        cy.get("[role='dialog'] .p-dropdown .p-dropdown-label").click()
        cy.get("[role='dialog'] [role='listbox']").contains("li span", 'Video').click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get("[datakey='rpmEnrollmentId'] tbody tr").first()
        .find("td:nth-child(7) span").should('be.visible')
    })

    it("Edit timelogs for a patient", () => {
        cy.get("[datakey='rpmEnrollmentId'] tbody tr td:last-child span:last-child").first().click({force:true})
        cy.get(".p-menu-list .p-menuitem:nth-child(2)").click()
        cy.get("[ptooltip='Edit']").first().click()
        cy.get("[role='dialog'] .p-dropdown .p-dropdown-label").click()
        cy.get("[role='dialog'] [role='listbox']").contains("li span", 'In-Person Visit').click()
        cy.wait(2000)
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get('.p-toast-summary').should('contain', 'success')
    })

    it("Delete timelogs for a patient", () => {
        cy.get("[ptooltip='Delete']").first().click()
        cy.get("button").contains('.p-button-label', 'Yes').click()
        cy.get('.p-toast-summary').should('contain', 'success')
    })
})