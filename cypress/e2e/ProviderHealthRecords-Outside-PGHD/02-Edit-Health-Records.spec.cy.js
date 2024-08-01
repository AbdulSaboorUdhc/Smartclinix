
describe("Edit Health Recrods of a Patient from Provider", ()=> {
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
                cy.wrap($el).should('be.visible').click({force:true})
              }
        })
        cy.wait(3000) 
    })
    
    it.skip("Editing a Vital Record", () => {
        cy.get('a span').contains("Vitals").click()
        cy.wait(2000)
        cy.get("td span svg").first().click()
        cy.wait(2000)
        cy.get("[placeholder='Systolic..'] input").clear().type('171').should('have.value', '171')
        cy.get("[placeholder='Diastolic..'] input").clear().type('200').should('have.value', '200')
        cy.get("[placeholder='centimeters']").eq(1).clear().type('166').should('have.value', '166')
        cy.wait(2000)
        cy.get(".negative-top-vital .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Editing a Lab Results", () => {
        cy.wait(2000)
        cy.get('a span').contains("Results").click()
        cy.get(".list-action-icons > [ptooltip='Edit'] svg").click()
        cy.get("#remarks").clear().type('This is an updated test result by provider', {force:true})
        cy.get("tr[id='row_0_0_0'] td:nth-child(1)").click()
        cy.get(".expanded-row input[type='text']").type("Added observation remarks by provider")

        cy.get(".same-width-item-120 .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it('Edit Medicine from the Medications List', () => {
        cy.get('a').contains("Medications List").click()
        cy.wait(2000)
        cy.get("[ptooltip='Edit']").first().click()
        cy.get("[placeholder='Enter Medication Instructions']").type('Added instructions by provider')

        cy.get(".same-width-item-60 .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it('Edit the Allergies of a Patient by provider', () => {
        cy.get('a').contains("Allergies").click()
        cy.get("span svg[width='13'][height='13']").first().click({force:true})
        cy.get(".p-dropdown-label.p-inputtext").contains("Active").click()
        cy.get(".p-dropdown-items .p-dropdown-item").contains('InActive').click()
        cy.get("[placeholder='Remarks']").clear().type('Allergy status is updated by provider.')
        
        cy.get(".heading-left-right .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Editing a Past Medical History", () => {
        cy.get('a span').contains("Histories").click()
        cy.get("checkicon ~ span").click()
        cy.get("[ptooltip='Edit']").first().click()
        cy.get(".p-dropdown-label").contains('Active').click() 
        cy.get(".p-dropdown-panel .p-dropdown-item").contains('Treated').click()
        cy.get(".p-button-icon").eq(0).click()
        cy.get("[formcontrolname='remarks']").clear().type('Medical History is updated by provider')

        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Editing a Past Surgical History", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Surgical History').click()
        cy.get("[ptooltip='Edit']").first().click()
        cy.get("td:nth-child(5) input").type("DR.Punk")
        cy.get(".p-button-icon").eq(0).click()
        cy.get(".form-control.RemarksArea").clear().type('Surgical History is added by provider')

        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Editing a Hospitalization Record", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Hospitalization History').click()
        cy.get("[ptooltip='Edit']").first().click()
        cy.get(".form-control.custom-textarea").type('Hospitalization Remarks is added by provider.')

        cy.get(".text-right .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Editing a Family History by Searching", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Family History').click()
        cy.wait(3000)
        cy.get("[ptooltip='Edit']").first().click()
        cy.get("[placeholder='Note']").clear().type('Added a note in family history by provider.')

        cy.get(".d-flex .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Editing a Social History of a Patient", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Social History').click()
        cy.get(".contact-heading .icon span:nth-child(1)").first().click()
        cy.get(".p-float-label .custom-textarea").clear().type('Added a remarks for social history')
        cy.get(".p-dialog-footer .btn-success").click()

        cy.get('.p-toast-summary').should('contain.text', 'Success') 
    })

})