
describe("Edit Health Recrods of a Patient", ()=> {
    before("" , () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.patientUrl)
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.wait(2000)
        cy.contains("Login").click()
        cy.patientLogin('rrollins', 'Password1@')
        cy.wait(2000)
        cy.contains('Health Record').click()
    })

    it.skip("Updating a Vitals Record", () => {
        cy.get("td span svg").first().click()
        cy.wait(2000)
        cy.get("[placeholder='Systolic..'] input").clear().type('61').should('have.value', '61')
        cy.get("[placeholder='Diastolic..'] input").clear().type('121').should('have.value', '121')
        cy.get("[placeholder='centimeters']").eq(1).clear().type('196').should('have.value', '196')
        cy.wait(2000)
        cy.get(".negative-top-vital .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Updating a Lab Result", () => {
        cy.get("a[routerlink='lab-results']").click()
        cy.get(".list-action-icons > [ptooltip='Edit'] svg").click()
        cy.get(".p-dropdown-label").contains('Final').click() 
        cy.get(".p-dropdown-panel .p-dropdown-item").contains('Corrected').click()
        cy.get("#remarks").clear().type('This is an updated test result')
       
        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it('Edit Medicine from the Medications List', () => {
        cy.get("a[routerlink='medications-list']").click()
        cy.wait(2000)
        cy.get("[ptooltip='Edit']").first().click()
        cy.get("[placeholder='Free signature text']").type('Added signature text')
        
        cy.get(".text-right .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it('Edit the added Allergies of a Patient', () => {
        cy.get("a[routerlink='allergies']").click()
        cy.get(".d-flex .success").last().click()
        cy.get(".p-dropdown-label.p-inputtext").contains("Active").click()
        cy.get(".p-dropdown-items .p-dropdown-item").contains('Resolved').click()
        cy.get("[placeholder='Remarks']").type('Allergy status is updated.')
        
        cy.get(".heading-left-right .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Edit Past Medical History", () => {
        cy.get("a[routerlink='past-medical-history']").click()
        cy.get("[ptooltip='Edit']").first().click()
        cy.get(".p-dropdown-label").contains('Active').click() 
        cy.get(".p-dropdown-panel .p-dropdown-item").contains('Treated').click()
        cy.get(".p-button-icon").eq(0).click()
        cy.get("[formcontrolname='remarks']").clear().type('Medical History is updated')
       
        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Edit Past Surgical History", () => {
        cy.get("a[routerlink='past-surgical-history']").click()
        cy.get("[ptooltip='Edit']").first().click()
        cy.get("[placeholder='Enter here..']").type("DR. Lesner")
        cy.get(".p-button-icon").eq(0).click()
        cy.get(".form-control.RemarksArea").clear().type('Surgical History is updated')
       
        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Edit a Hospitalization record", () => {
        cy.get("a[routerlink='hospitalizations']").click()
        cy.get("[ptooltip='Edit']").first().click()
        cy.get(".form-control.custom-textarea").clear().type('Hospitalization Remarks is updated')
        cy.get(".text-right .btn-success").click()
        
        cy.get('.p-toast-summary').then(($toast) => {
            const toastMessage = $toast.text().trim()
            expect(toastMessage).to.eq('Success')
        
            // if (toastMessage !== 'Success') {
            //     cy.get("a[routerlink='family-history']").click()
            //     cy.get('.p-confirm-dialog-accept > .p-button-label').click()
            // }
        })
    })

    it("Edit a Family History of a Patient", () => {
        cy.get("a[routerlink='family-history']").click()
        cy.wait(3000)
        cy.get("td .cursor-pointer").first().click()
        cy.get("[placeholder='Note']").clear().type('Added a note in family history')

        cy.get(".page-heading-block .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')    
    })

    it("Edit a Social History of a Patient", () => {
        cy.get("a[routerlink='social-history']").click()
        cy.get(".contact-heading .cursor-pointer").eq(0).first().click()
        cy.get(".p-float-label .custom-textarea").clear().type('Added a remarks for social history')
        cy.get(".p-dialog-footer .btn-success").click()
        
        cy.get('.p-toast-summary').should('contain.text', 'Success')    
    })

})