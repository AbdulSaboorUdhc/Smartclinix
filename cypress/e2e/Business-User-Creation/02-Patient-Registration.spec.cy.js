import { getRandomUserData } from '../RandomDataGenration';
import PatientRegistrationPage from '../../support/PageObject/patient-registration-page';

let inboxId
let emailBody
let verificationCode
let emailAddress
let firstName
let lastName
describe("Patient registeration", ()=> {

    before("" , () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.patientUrl)
        })
        cy.fixture("patientCred.json").then((patientCredConfig) => {
      
            if (patientCredConfig.generateRandomUser) {
              const user = getRandomUserData("smart", "clinix");
                firstName = user.firstName;
                lastName = user.lastName;
            }
        })
    })

    it("Register as a Patient User", ()=> {
        const patientRegistrationPage = new PatientRegistrationPage()

        patientRegistrationPage.clickRegisterButton()
        patientRegistrationPage.fillFirstName(firstName)
        patientRegistrationPage.fillLastName(lastName)
        patientRegistrationPage.selectDateOfBirth(6, 'November', 1996)
        patientRegistrationPage.selectGender('Male')
        patientRegistrationPage.fillPhoneNumber('12345678900')

        cy.mailslurp().then(mailslurp => mailslurp.createInbox()).then(inbox => {
            inboxId = inbox.id
            emailAddress = inbox.emailAddress
            patientRegistrationPage.fillEmail(emailAddress)
        })
        
        patientRegistrationPage.fillUserName(lastName)
        patientRegistrationPage.fillPassword(Cypress.env('PASSWORD'))
        patientRegistrationPage.fillConfirmPassword(Cypress.env('PASSWORD'))
        patientRegistrationPage.clickRegisterContinueButton()
        cy.mailslurp().then(mailslurp => mailslurp.waitForLatestEmail(inboxId, 30000, true))
        .then(email => { expect(email.subject).to.contain("User Confirmation")
            emailBody = email.body
            const parser = new DOMParser()
            const doc = parser.parseFromString(emailBody, 'text/html')
            var vCode = doc.querySelector("div > p:nth-of-type(4)").textContent
            verificationCode = vCode.trim().slice(0)
            cy.get(".p-inputmask").each(($el) => {
                patientRegistrationPage.enterVerificationCode(verificationCode)
            })
        })
        patientRegistrationPage.clickFinalizeRegistrationButton()
        
        cy.mailslurp().then(mailslurp => mailslurp.waitForLatestEmail(inboxId, 30000, true))
        .then(email => { expect(email.subject).to.contain("Registration Completed - Login Details Enclosed")})
        
        cy.url().should("contain", "Login?ReturnUrl")
    })

    it("Login with a new user", () => { 
        cy.patientLogin(lastName, Cypress.env('PASSWORD'), {setTimeout: 6000})
        // cy.get("div[class='user-icon'] span").should('be.visible').then($spanElement => {
        //     const fullName = $spanElement.text().trim();
        //     const firstCharFirstName = fullName.charAt(0);
        //     const firstCharLastName = fullName.charAt(fullName.indexOf(" ") + 1);
        //     const expectedText = `${firstCharFirstName}${firstCharLastName}`;
        //     expect(fullName).to.be.equal(expectedText);
        //   });
    })
})