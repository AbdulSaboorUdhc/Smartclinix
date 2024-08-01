
describe("Delete Health Recrods of a Patient", ()=> {

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
    
    it("Deleting a result", () => {
        cy.get("a[routerlink='lab-results']").click()
        cy.get(".list-action-icons > [ptooltip='Delete'] svg").click()
        cy.get(".p-dialog-footer .p-button-label").eq(1).click()
       
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Deleting a Medication", () => {
        cy.get("a[routerlink='medications-list']").click()
        cy.get("[ptooltip='Remove']").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()
       
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Deleting a Allergy listing", () => {
        cy.get("a[routerlink='allergies']").click()
        cy.get(".d-flex .danger").last().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()
       
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Deleting a Medical History", () => {
        cy.get("a[routerlink='past-medical-history']").click()
        cy.get("[ptooltip='Delete']").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()

        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Deleting a Surgical History", () => {
        cy.get("a[routerlink='past-surgical-history']").click()
        cy.get("[ptooltip='Delete']").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()
        
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Deleting a Hospitalization record", () => {
        cy.get("a[routerlink='hospitalizations']").click()
        cy.get("[ptooltip='Delete']").first().click()
        cy.get(".p-confirm-dialog-accept > .p-button-label").click()
        
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Deleting a Family History", () => {
        cy.get("a[routerlink='family-history']").click()
        cy.wait(3000)
        cy.get("td .cursor-pointer").first().click()
        cy.get(".text-right .cursor-pointer").first().click()
        cy.get("[id='confirmDialogModel.actionName']").click()
         
        cy.get(".page-heading-block .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success') 
    })

    it("Deleting a Social History", () => {
        cy.get("a[routerlink='social-history']").click()
        cy.get(".contact-heading .cursor-pointer").eq(1).first().click()
        cy.get(".p-confirm-dialog-accept").click()
        
        cy.get('.p-toast-summary').should('contain.text', 'Success') 
    })
})