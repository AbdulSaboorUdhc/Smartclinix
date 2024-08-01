import jsdom from 'jsdom';
import { getRandomUserData } from '../RandomDataGenration';
let originalUrl;
let inboxId
let emailAddress
let generatedFirstName
let generatedLastName
const { JSDOM } = jsdom;

describe("Consent forms Manipulation from porvider", () => {

    before("", () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.providerUrl)
        })
        originalUrl = cy.url()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.providerLogin("cmpunk", "Password1@")
        cy.fixture("patientCred.json").then((patientCredConfig) => {
      
            if (patientCredConfig.generateRandomUser) {
              const user = getRandomUserData("consent", "user");
                generatedFirstName = user.firstName;
                generatedLastName = user.lastName;

                cy.writeFile("cypress/fixtures/sharedData.json", { generatedLastName, generatedFirstName })
            }
        })
    })

    it("Sending a Consent by Creating new Patient", () => {
        cy.contains("Add Patient").click()
        cy.wait(3000)
        cy.get("#firstNameInput").type(generatedFirstName)
        cy.get("#lastNameInput").type(generatedLastName)
        cy.get("input[class*='dateTimeField']").click()
        cy.get(".p-datepicker-year").click()
        cy.get(".p-yearpicker-year").contains('2021').click()
        cy.get(".p-monthpicker-month").contains('Jun').click()
        cy.get('.p-datepicker-calendar td span').contains('10').click()
        cy.get("[formcontrolname='gender'] > .p-dropdown > .p-dropdown-trigger").click()
        cy.get("li[aria-label='Male']").click()
        cy.mailslurp().then(mailslurp => mailslurp.createInbox()).then(inbox => {
            inboxId = inbox.id
            emailAddress = inbox.emailAddress
            cy.get('[formcontrolname="email"]').type(emailAddress)
        })
        cy.contains("Patient Consents").click()
        cy.get("tbody tr td:nth-child(3)").contains("Authorization To Release Medical Information to Family Members")
        .parent()
        .find("td:nth-child(8)")
        .should('include.text', 'Draft')
        cy.get("tbody tr td:nth-child(3)").contains("Authorization To Release Medical Information to Family Members")
        .parent()
        .find("td:nth-child(1) [type='checkbox']")
        .click({force: true})
        cy.get("tbody tr td:nth-child(3)").contains("Consent for the Release of Medical Records")
        .parent()
        .find("td:nth-child(8)")
        .should('include.text', 'Draft')
        cy.get("tbody tr td:nth-child(3)").contains("Consent for the Release of Medical Records")
        .parent()
        .find("td:nth-child(1) [type='checkbox']")
        .click({force: true})
         cy.get("button[type='submit']").click()
        cy.url().should('not.eq', 'https://testprac21.scxtest.net/#/patients/registration')
        cy.mailslurp().then(mailslurp => {
            return mailslurp.waitForLatestEmail(inboxId, 30000, true);
        })
        .then(email => {
            expect(email.subject).to.contain("Consent Form")
            const dom = new JSDOM(email.body);
            const link = dom.window.document.querySelector('a');
            if (link) {
            const activationLink = link.href;
            cy.visit(activationLink);
            return
            } 
        })
        cy.get('[formcontrolname="month"] .p-dropdown-label').click()
        cy.get('[role="listbox"] li span').contains('June').click()
        cy.get('[formcontrolname="day"] .p-dropdown-label').click()
        cy.get('[role="listbox"] li span').contains('10').click()
        cy.get('[formcontrolname="year"] .p-dropdown-label').click()
        cy.get('[role="listbox"] li span').contains('2021').click()       
        cy.get('.line-6 .btn-success').click()
        cy.get("#agreeCheck_0").check({force:true})
        cy.get("#selectAll").check({force:true})
        cy.get("#name").type(generatedFirstName)
        cy.get(".enrollment-ctrl-btn button").click()
        // cy.get("#agreeCheck_1").check({force:true})
        // cy.get("#familyMemberName").type('jay')
        // cy.get("#familyMemberRelationId .p-dropdown-label").click()
        // cy.get("li[aria-label='Brother']").click()
        cy.get('[placeholder="Type Signature.."]').type(generatedFirstName)
        cy.get(".enrollment-ctrl-btn .btn-success").click()
        cy.get(".rpm-consent-wr-inner > .text-center").should('include.text', 'Thank you for submitting')
        cy.go(-1)
        cy.get(".p-tabview-nav li:nth-child(4)").click()
        cy.get("tbody tr td:nth-child(3)").contains("Consent for the Release of Medical Records")
        .parent()
        .find("td:nth-child(8)")
        .should('include.text', 'Signed')
        cy.get("tbody tr td:nth-child(3)").contains("Authorization To Release Medical Information to Family Members")
        .parent()
        .find("td:nth-child(8)")
        .should('include.text', 'Pending')
    })

    it("Send Consent to existing Patient", () => {
        cy.get("tbody tr td:nth-child(3)").contains("Consent for Treatment")
        .parent()
        .find("td:nth-child(8)")
        .should('include.text', 'Draft')
        cy.get("tbody tr td:nth-child(3)").contains("Consent for Treatment")
        .parent()
        .find("td:nth-child(9) span:nth-child(1)")
        .click()
        cy.get("#sentByEmail").click({force:true})
        cy.get(".p-dialog-footer .btn-success").click()
        cy.mailslurp().then(mailslurp => {
            return mailslurp.waitForLatestEmail(inboxId, 30000, true);
        })
        .then(email => {
            expect(email.subject).to.contain("Consent Form")
            const dom = new JSDOM(email.body);
            const link = dom.window.document.querySelector('a');
            if (link) {
            const activationLink = link.href;
            cy.visit(activationLink);
            return
            } 
        })
        cy.get('[formcontrolname="month"] .p-dropdown-label').click()
        cy.get('[role="listbox"] li span').contains('June').click()
        cy.get('[formcontrolname="day"] .p-dropdown-label').click()
        cy.get('[role="listbox"] li span').contains('10').click()
        cy.get('[formcontrolname="year"] .p-dropdown-label').click()
        cy.get('[role="listbox"] li span').contains('2021').click()
        cy.get('.line-6 .btn-success').click()
        cy.get("#agreeCheck_0").check({force:true})
        cy.get('[placeholder="Type Signature.."]').type(generatedFirstName)
        cy.get(".enrollment-ctrl-btn .btn-success").click()
        cy.get(".rpm-consent-wr-inner > .text-center").should('include.text', 'Thank you for submitting')
        cy.go('back')
        cy.get(".p-tabview-nav li:nth-child(4)").click()
        cy.get("tbody tr td:nth-child(3)").contains("Consent for Treatment")
        .parent()
        .find("td:nth-child(8)")
        .should('include.text', 'Signed')
    })

    it("Add a new consent for a user", () => {
        cy.get("button[class='btn btn-sm btn-success custom-btn-1']").click()
        cy.get("[formcontrolname='consentTypeId']").click()
        cy.get("[role='listbox'] li > div").contains("HIPAA Privacy Policy and Consent to treat").click()
        cy.get("div[class='text-right save-cancel-buttons consent-top-btn'] button:nth-child(2)").click()
        cy.get("tbody tr td:nth-child(3)").contains("HIPAA Privacy Policy and Consent to treat")
        .first()
        .parent()
        .find("td:nth-child(8)")
        .should('include.text', 'Signed') 
    })

    it("Edit a new consent for a user", () => {
        cy.get("tbody tr td:nth-child(3)").contains("Disclosure Consent Form")
        .parent()
        .find("td:nth-child(9) span:nth-child(2)")
        .click()
        cy.get("span").contains('Draft').click()
        cy.get(".p-dropdown-panel ul :nth-child(3) li span").click()
        cy.get("div[class='text-right save-cancel-buttons consent-top-btn'] button:nth-child(2)").click()
        cy.get("tbody tr td:nth-child(3)").contains("Disclosure Consent Form")
        .parent()
        .find("td:nth-child(8)")
        .should('include.text', 'Signed')
    })

    it("View and Download the signed consent", () => {
        cy.get("tbody tr td:nth-child(3)").contains("Disclosure Consent Form")
        .parent()
        .find("td:nth-child(9) span:nth-child(3)")
        .click()
        cy.get('.p-dialog-title .d-flex div').should('include.text', 'Disclosure Consent Form')
        cy.get('.p-dialog-header-close-icon').click()
    
        cy.intercept("GET", "https://api-gateway.scxtest.net/api/pms/Patient/*/DocumentManager/Document/*/GetPatientDocument").as("downloadPDF");

        cy.get("tbody tr td:nth-child(3)").contains("Disclosure Consent Form")
        .parent()
        .find("td:nth-child(9) span:nth-child(1)")
        .click()

        cy.wait("@downloadPDF").then((interception) => {

            expect(interception.response.statusCode).to.equal(200)
            expect(interception.response.body.extension).to.equal('.pdf')
            expect(interception.response.body.displayName).to.contain('Disclosure Consent Form')
        })    
    })

    it("Activate and create user credentials", () => {
        cy.get("a[routerlink='patients/list']").click()
        cy.get("tbody tr").first().find("td:nth-child(13) span:nth-child(5)").click({force:true})
        cy.get(".p-menu-list .p-menuitem a span:nth-child(2)").contains('Patient Login').click()
        cy.get("#sentByEmail").check({force: true})
        cy.get(".p-dialog-footer .btn-success").click()
        cy.mailslurp().then(mailslurp => {
            return mailslurp.waitForLatestEmail(inboxId, 30000, true);
        })
        .then(email => {
            expect(email.subject).to.contain("Activate Patient Account")
            const dom = new JSDOM(email.body);
            const link = dom.window.document.querySelector('a');
            if (link) {
            const activationLink = link.href;
            cy.visit(activationLink);
            return
            }
        })
        cy.wait(2000)
        cy.get("input[type='text']").type(generatedLastName)
        cy.get("input[class*='p-password-input']").eq(0).type(Cypress.env('PASSWORD'))
        cy.get("input[class*='p-password-input']").eq(1).type(Cypress.env('PASSWORD'))
        cy.wait(3000)
        cy.get("button[class$=btn-blue]").click()
        cy.get('.line-3').should('have.text', ' Your account has been created successfully ')
    })
})
