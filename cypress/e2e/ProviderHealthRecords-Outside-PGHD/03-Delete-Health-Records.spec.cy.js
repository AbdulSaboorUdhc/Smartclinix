
describe("Delete Health Recrods of a Patient by Provider", ()=> {
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

    it("Deleting a Lab Results", () => {
        cy.get('a span').contains("Results").click()
        cy.get(".list-action-icons > [ptooltip='Delete'] svg").click()
        cy.get(".p-dialog-footer .p-button-label").eq(1).click()

        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it('Delete Medicine from the Medications List', () => {
        cy.get('a').contains("Medications List").click()
        cy.get("[ptooltip='Delete']").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()
       
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it('Delete the Allergies of a Patient by provider', () => {
        cy.get('a').contains("Allergies").click()
        cy.get("td:nth-child(7) span:nth-child(2)").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()

        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Deleting a Past Medical History", () => {
        cy.get('a span').contains("Histories").click()
        cy.get("[ptooltip='Delete']").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()

        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Deleting a Past Surgical History", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Surgical History').click()
        cy.get("[ptooltip='Delete']").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()

        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Deleting a Hospitalization Record", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Hospitalization History').click()
        cy.get("[ptooltip='Delete']").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()

        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Deleting a Family History by Searching", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Family History').click()
        cy.wait(3000)
        cy.get("td .cursor-pointer").first().click()
        cy.get(".text-right .cursor-pointer").first().click()
        cy.get(".p-dialog-footer button:nth-child(2)").click()

        cy.get(".d-flex .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success') 
    })

    it("Deleting a Social History of a Patient", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Social History').click()
        cy.get(".contact-heading .icon span:nth-child(2)").first().click()
        cy.get(".p-confirm-dialog-accept").click()
        
        cy.get('.p-toast-summary').should('contain.text', 'Success') 
    })

})