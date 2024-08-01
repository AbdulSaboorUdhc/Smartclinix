/// <reference types ="cypress" />

import jsdom from 'jsdom';
import { getRandomUserData } from '../RandomDataGenration';

let originalUrl;
let inboxId
let emailAddress
let firstName
let lastName
const { JSDOM } = jsdom;
describe("Enroll Patients in RPM", () => {

    before("", () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.providerUrl)
        })
        originalUrl = cy.url()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.providerLogin("cmpunk", "Password1@")
        cy.get("a[routerlink='/rpm']").click()
        cy.fixture("patientCred.json").then((patientCredConfig) => {
      
            if (patientCredConfig.generateRandomUser) {
              const user = getRandomUserData("rpm", "user");
                firstName = user.firstName;
                lastName = user.lastName;
            }
        })
    })

    it.skip('Enroll Patient by Search from the existing ones', ()=> {
        cy.contains('Enroll Patients').click()
        cy.get('input[role="combobox"][placeholder="Search Pateints"]').type('roman')
        cy.get("ul li .patient-name-cell .name").each($el => {
            const nameText = $el.text().trim()
              if (nameText.includes('Roman Rollins')) {
                cy.wrap($el).click({force:true})
              }
        })
        cy.get("[placeholder= 'Select Provider' ] span[role='combobox']").click()
        cy.get(".toBody ul li span").each($pn => {
            const pName = $pn.text().trim()
            if (pName.includes('Cm Punk')){
                cy.wrap($pn).click({force:true})
            }
        })
        cy.wait(3000)
        cy.get('label[for="patientLoginLink"]').click({force:true})
        cy.get('.p-dialog-footer .btn-success').click()
        cy.get("a > .patient-name-link").each($txt => {
            const patientName = $txt.text().trim()
            if (patientName === 'Roman Rollins') {
                expect(patientName).to.equal('Roman Rollins')
            }
        })
    })

    it('Enroll Patient by Adding a New Patient', ()=> {
        cy.contains('Enroll Patients').click()
        cy.wait(2000)
        cy.get('.search-btn-outer > .btn').click()
        cy.get('[formcontrolname="firstName"]').type(firstName)   
        cy.get('[formcontrolname="lastName"]').type(lastName)
        cy.get("p-calendar[formcontrolname='dateOfBirth'] input[class*='dateTimeField']").click()
        cy.get(".p-datepicker-year").click()
        cy.get(".p-yearpicker-year").contains('2022').click()
        cy.get(".p-monthpicker-month").contains('May').click()
        cy.get('.p-datepicker-calendar td span').contains('20').click()
        cy.get('[formcontrolname="gender"]').click()
        cy.get('li[aria-label="Male"]').click()
        cy.get('.p-dialog-content .text-right .btn-success').click()
        cy.get("[placeholder= 'Select Provider' ] span[role='combobox']").click()
        cy.get(".toBody ul li span").each($pn => {
            const pName = $pn.text().trim()
            if (pName.includes('Cm Punk')){
                cy.wrap($pn).click({force:true})
            }
        })
        cy.wait(2000)
        cy.mailslurp().then(mailslurp => mailslurp.createInbox()).then(inbox => {
            inboxId = inbox.id
            emailAddress = inbox.emailAddress
            cy.get('[formcontrolname="email"]').type(emailAddress)
        })
        cy.get('.p-dialog-footer .btn-success').click()
        cy.get(".patient-name-link").each($txt => {
            const patientName = $txt.text().trim()
            if (patientName === firstName +' '+ lastName) {
                expect(patientName).to.equal(firstName +' '+ lastName)
            }
        })
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
    })     

    it("Create user Credentials", () => {
        cy.get("input[type='text']").type(lastName)
        cy.get("input[class*='p-password-input']").eq(0).type(Cypress.env('PASSWORD'))
        cy.get("input[class*='p-password-input']").eq(1).type(Cypress.env('PASSWORD'))
        cy.wait(3000)
        cy.get("button[class$=btn-blue]").click()
        cy.get('.line-3').should('have.text', ' Your account has been created successfully ')
        cy.go('back')
    })

    it("RPM Consent Form signing", () => {
        cy.get("ul li:nth-child(2) .p-tabview-nav-link").click()
        cy.get("scx-rpm-list [datakey='rpmEnrollmentId'] tbody tr td:last-child span:last-child").first().click({force:true})
        cy.get(".p-menu-list .p-menuitem a span:nth-child(2)").contains('RPM Consent').click({force:true})
        cy.get(".p-dialog-title").should(($title) => {
            const text = $title.text();
            expect(text).to.include('(Draft)')
        })
        cy.get("#sentByEmail").check({force: true})
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
        cy.get('[role="listbox"] li span').contains('May').click()
        cy.get('[formcontrolname="day"] .p-dropdown-label').click()
        cy.get('[role="listbox"] li span').contains('20').click()
        cy.get('[formcontrolname="year"] .p-dropdown-label').click()
        cy.get('[role="listbox"] li span').contains('2022').click()
        cy.get('.line-6 .btn-success').click()
        cy.get("#agreeCheck_0").check({force:true})
        cy.get('[placeholder="Type Signature.."]').type(firstName)
        cy.get(".btn.btn-sm.btn-success").click()
        cy.get(".rpm-consent-wr-inner > .text-center").should('include.text', 'Thank you for submitting')
        cy.go('back')
        cy.get("ul li:nth-child(2) .p-tabview-nav-link").click()
        cy.get("scx-rpm-list [datakey='rpmEnrollmentId'] tbody tr td:last-child span:last-child").first().click({force:true})
        cy.get(".p-menu-list .p-menuitem a span:nth-child(2)").contains('RPM Consent').click({force:true})
        cy.get(".p-dialog-title").should(($title) => {
            const text = $title.text();
            expect(text).to.include('(Signed)')
        })
        cy.get(".p-dialog-header-icons > button").click()
    })
})