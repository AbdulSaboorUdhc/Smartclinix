
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

                cy.patientLogin(generatedLastName, Cypress.env('PASSWORD'))
            })
            cy.wait(6000)
            cy.get('.btn-lg').click()
            cy.get('.positioned-div > .btn').click()
    })   

    it("Signing Consent via Patient portal", () => {
        cy.wait(8000)
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