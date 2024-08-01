describe("Appointment Booking from Patient side", ()=> {

    before("" , () => {

        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.patientUrl)
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.contains("Login").click()
        cy.patientLogin('rrollins', 'Password1@')
    })

    it("Booking an appointment", () => {  
        cy.get("input[placeholder='Search Doctor..']").type('alex')
        cy.get(".card-view .mid-col .doc-name a").then(($txt) => {
            const name = $txt.text().trim()
            if(name.includes("")){
                expect(name).to.contain("Alexander Wil")
                cy.get('.self-pay-content > .text-center > .btn').contains('Book Appt.').click()
            } else {
                cy.log(name)
            }
        })
        cy.wait(4000)
        cy.get(".btn.btn-light-primary.time").should("be.visible").last().click().should("have.class", 'active')
        cy.get(".btn.btn-sm.btn-success").click()
        cy.get("textarea").type("appointment for test only")
        cy.get(".btn.btn-sm.btn-success").click()
        cy.get(".btn.btn-sm.btn-success").click()
        // cy.get(':nth-child(2) > .custom-control-label').click()
        // cy.get(".btn.btn-sm.btn-success").click()
        // cy.get('.braintree-option__card').click()
        cy.iframe('.__PrivateStripeElement > iframe').within(() => {
            cy.get("input[name='cardnumber']").type('4111 1111 1111 1111')
            cy.get("input[name='exp-date']").type('0530')
            cy.get("input[name='cvc']").type('555')
            cy.get("input[name='postal']").type('55555')
        }) 
        cy.get("button").contains('Pay Now').click()
        cy.get('.app-success-left > .info-text').should("contain", "You have successfully booked an appointment")
        cy.get("a[class*='mt-3']").click()
        cy.get("[routerlink='/book-appointment/my-appointments']").click()
        cy.get(".container .row").should("have.length.at.least", 1)
    })
})







  