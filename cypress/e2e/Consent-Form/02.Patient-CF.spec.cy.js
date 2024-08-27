
describe("Consent forms test from Patient", () => {
let generatedFirstName

    before("", () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.patientUrl)
        })
            cy.clearCookies()
            cy.clearLocalStorage()
            cy.contains("Login").click()    
            cy.readFile("cypress/fixtures/sharedData.json").then((data) => {
                const generatedLastName = data.generatedLastName;
                generatedFirstName = data.generatedFirstName;

                cy.patientLogin("clinix3304", Cypress.env('PASSWORD'))
            })
            cy.wait(6000)
            cy.get('.btn-lg').click()
            // cy.get('.positioned-div > .btn').click()
    })   

    it('Signed a Consent from Patient before login', () => {
        let maxAttempts = 9;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (attempt === 4) {
                cy.get('.custom-control-label').click({force: true})
            } else {
                cy.get('.text-right > .btn').click();
            }            
            cy.wait(500);
        }
        
        cy.get('[placeholder="Type Signature.."]').type(generatedFirstName)
        cy.contains('Finish').click()
        cy.wait(12000)
    })

    it("Signing Consent via Patient portal after login ", () => {
        cy.reload()
        cy.url().should('eq', 'https://testprac21.scxtest.net/pportal/#/book-appointment')
        cy.get('a[routerlink="my-account"]').should('be.visible').click({force:true})
        cy.get("ul[role='tablist'] li:nth-child(4) a").click()
        cy.get("tbody tr td:nth-child(2)").contains("Financial Statement Consent")
        .parent()
        .find("td:nth-child(8) span:nth-child(1)")
        .click()
        cy.get('.col-md-12 > :nth-child(3)').should('contain', 'Self-Pay Policy')
        cy.get('.col-md-12 > :nth-child(5)').should('contain', 'Insurance Policy')
        cy.get('.col-md-12 > :nth-child(7)').should('contain', 'Overdue and Credit Balances')
        cy.get('#agreeCheck').click({force:true})
        cy.get('span > .form-control').type(generatedFirstName) 
        cy.get('.btn-secondary').click()
        cy.get("tbody tr td:nth-child(2)").contains("Financial Statement Consent")
        .parent()
        .find("td:nth-child(7)")
        .should('include.text', 'Signed')

        cy.intercept("GET", "https://api-pms.scxtest.net/Patient/*/DocumentManager/Document/*/GetPatientDocument").as("downloadPDF");

        cy.get("tbody tr td:nth-child(2)").contains("Financial Statement Consent")
        .parent()
        .find("td:nth-child(8) span:nth-child(2)")
        .click()

        cy.wait("@downloadPDF").then((interception) => {

            expect(interception.response.statusCode).to.equal(200)
            expect(interception.response.body.extension).to.equal('.pdf')
            expect(interception.response.body.displayName).to.contain('Financial Statement Consent')
           
        })
    }) 
})