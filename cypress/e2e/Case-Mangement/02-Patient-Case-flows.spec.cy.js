/// <reference types = "cypress" />

describe('Case Creation from paitent portal', ()=> {
    
    before('', ()=> {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.patientUrl)
        })
            cy.clearCookies()
            cy.clearLocalStorage()
            cy.contains("Login").click()   
            cy.providerLogin("rrollins", "Password1@") 
            cy.url().should('contain', "account/signin-callback")
            cy.wait(8000)
            cy.get("[routerlink='/second-opinion']").click()
    })

    it("Patient creates a new case and verify its status", () => {
        cy.contains("Select Service Type").click()
        cy.get("ul[role='listbox'] li span").each(($st) => {
            const serviceType = $st.text().trim()
            if(serviceType === 'Written Report'){
                cy.wrap($st).click()
            }
        })
        cy.contains("Select Specialty").click()
        cy.get("ul[role='listbox'] li span").each(($s) => {
            const serviceType = $s.text().trim()
            if(serviceType === 'Addiction Medicine'){
                cy.wrap($s).click()
            }
        })
        cy.get("textarea[placeholder='Reason for Consultation']").type('Case creation by patient.')
        cy.get("button[type='submit']").click()
        cy.get(".intake-inner div:nth-child(3) .btn-secondary").click()
        cy.get(".btn.btn-green").click()
        cy.get(".dashboard-view-card .header .name-speciality").first().should('contain.text', 'Requested')
    })
})