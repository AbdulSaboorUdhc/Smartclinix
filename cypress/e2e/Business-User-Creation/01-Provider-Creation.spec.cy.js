const jsdom = require('jsdom');
import { getRandomUserData } from '../RandomDataGenration';
import ProviderCreationPage from '../../support/PageObject/provider-creation-page';
import UserCredentialsCreation from '../../support/PageObject/user-credentials-page';

let inboxId
let emailAddress
let firstName 
let lastName
const { JSDOM } = jsdom;
describe("Provider user account creation & verification" , () => {

    before("", () => {
      cy.fixture("urls.json").as("url")
      cy.get("@url").then((url) => {
          cy.visit(url.providerUrl)
      })
      cy.clearCookies()
      cy.clearLocalStorage()
      cy.providerLogin("cmpunk", "Password1@")
      cy.contains("Welcome").should('exist').should("have.text", " Welcome To YOUR VIRTUAL CARE PLATFORM ")
      cy.fixture("patientCred.json").then((patientCredConfig) => {
      
        if (patientCredConfig.generateRandomUser) {
          const user = getRandomUserData("smart", "clinix");
            firstName = user.firstName;
            lastName = user.lastName;
        }
    })

    })
    it('Navigate to the admin panel', () => {
        cy.get("span[class*='user-name'] span[class$='text']").click()
        cy.get("li:nth-child(4) a:nth-child(1) span:nth-child(2)").click()
        cy.get("li:nth-child(4) a span").click()
        cy.wait(4000)
    })
    it("Create and verify a new provider user", () => {
      const providerCreationPage = new ProviderCreationPage()

        providerCreationPage.clickCreateProviderButton()
        providerCreationPage.fillFirstName(firstName)
        providerCreationPage.fillLastName(lastName)
        cy.mailslurp().then(mailslurp => mailslurp.createInbox()).then(inbox => {
            inboxId = inbox.id
            emailAddress = inbox.emailAddress
            providerCreationPage.fillEmail(emailAddress)
        })
        providerCreationPage.selectGender('Male')
        providerCreationPage.selectUserRole('Provider')
        // cy.get("button[class*=p-datepicker-trigger] svg").click()
        // cy.get("[class*=p-datepicker-year]").select('1998')
        // cy.get("[class*=p-datepicker-month]").select('July')
        // cy.get("[class*=p-datepicker-calendar] tbody tr td span").contains('17').click()
        // cy.get(".p-accordion-toggle-icon").eq(1).click()
        // cy.get('.btn-warning-light').selectFile('D:\\SmartClinix\\cypress\\fixtures\\sample.jpg')
        // cy.get('.uploadImg-providerProfileImgNameControl > #providerProfileImgNameControl').should('have.attr', 'src').and('contains', 'data:image/jpeg')
        // cy.get("input[formcontrolname='totalExperience']").type('7 years')
        // cy.get(".p-multiselect-label").click()
        // cy.get("input[role='textbox']").type('eng')
        // cy.get(".p-multiselect-items-wrapper > ul").each( $txt => {
        //   if($txt.text().includes('English' )) {
        //     cy.wrap($txt).click()
        //   }
        // })
        // cy.get("input[formcontrolname='specialityTitle']").click({force:true}).type("ENT Specialist")
        providerCreationPage.addTaxonomy('phy', 'Allergy Physician')
        cy.get(".p-datatable-wrapper > table > tbody >tr ").should("have.length", 2)
        providerCreationPage.submitForm()
        cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", firstName + ' ' + lastName)
    })
    it("Account verification via email", () => {
        cy.get("tbody tr:nth-child(1) td:nth-child(8) span:nth-child(1)").click()
        cy.get("div[role=dialog] > div[class*=p-dialog-footer] > p-footer > div > span:nth-child(1)").click()
        cy.get('.p-toast-summary').should('have.text', 'success')
        cy.get("tbody tr:nth-child(1) td:nth-child(6)").should("have.text", 'Pending')
        
        cy.mailslurp().then(mailslurp => {
            return mailslurp.waitForLatestEmail(inboxId, 30000, true);
        })
        .then(email => {
          expect(email.subject).to.contain("Send Login Activation")
          const dom = new JSDOM(email.body);
          const link = dom.window.document.querySelector('a');
          if (link) {
            const activationLink = link.href;
            cy.visit(activationLink);
            return
          } 
        })
    })
    it("Create user Credentials", () => {
      const userCredentialsCreation = new UserCredentialsCreation()
      
      userCredentialsCreation.createUserCredentials(lastName, Cypress.env('PASSWORD'))
    })
    it("Login into the new user account", ()=> {
      cy.clearCookies()
      cy.clearLocalStorage()
      cy.providerLogin(lastName, Cypress.env('PASSWORD'))
      cy.get('.user-name > .text').should("contain", ' ' + firstName + ' ' + lastName + ' ')
    })
})