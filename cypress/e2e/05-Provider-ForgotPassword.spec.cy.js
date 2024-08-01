/// <reference types="Cypress" />
// const jsdom = require('jsdom');

describe("Test forgot password for provider", ()=> {
    // let inboxId = "898873de-1e85-4c37-809a-ce5b6ba6c936"
    const serverID = "afvafexx"
    let userName = "clinix427"
    let password = "Password1@"
    const email = 'smart.clinix427@afvafexx.mailosaur.net'
    // const { JSDOM } = jsdom;
    before("" , () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
        cy.visit(url.providerUrl)
        })
    })

    it("Forgot password", () => {
        cy.get("[class='red-bold-text']").click()
        cy.get('#Input_Username').type(userName)
        cy.get('form > .btn').click()
        cy.get('.text-success').contains('Password reset link has been sent')
        // cy.mailslurp().then(mailslurp => {
        //     return mailslurp.waitForLatestEmail(inboxId, 30000, true);
        //   })
        //   .then(email => {
        //     expect(email.subject).to.contain("Reset Password")
        //     const dom = new JSDOM(email.body);
        //     const link = dom.window.document.querySelector('a');
        //     if (link) {
        //       const resetPasswordLink = link.href;
        //       cy.visit(resetPasswordLink);
        //       return
        //    } 
        // })

        cy.mailosaurGetMessage(serverID, {sentTo: email}).then(($email) => {
          expect($email.subject).to.equal('Reset Password')
          let setPw = $email.html.links[0].href
          cy.visit(setPw)
        })
        cy.wait(3000)
        cy.get("#Input_Username").type(userName)
        cy.get("#Input_Password").type(password)
        cy.get("#Input_ConfirmPassword").type(password)
        cy.get("button[type='submit']").click()
    })
    
    it("Login with a new user", () => { 
        cy.providerLogin(userName, password)  
    })
})