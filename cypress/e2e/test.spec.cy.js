/// <reference types="Cypress" />
 describe('Provider user account creation & verification', () => {
  // const serverID = "afvafexx"
  // const password = 'Password1!'
  // const emailDomain = '@afvafexx.mailosaur.net'
  // const generateRandomNumberSuffix = (length) => {
  //   const digits = '0123456789';
  //   return Array.from({ length }, () => digits[Math.floor(Math.random() * digits.length)]).join('');
  // };
  // const baseFirstName = 'smart';
  // const baseLastName = 'clinix';

  // const getRandomUserData = () => {
  //   const randomNumberSuffix = generateRandomNumberSuffix(3);

  //   const user = {
  //     firstName: baseFirstName,
  //     lastName: `${baseLastName}${randomNumberSuffix}`,
  //     email: `${baseFirstName.toLowerCase()}.${baseLastName.toLowerCase()}${randomNumberSuffix}${emailDomain}`,
  //   };

  //   return user;
// };

  // const user = getRandomUserData();
  // const { firstName, lastName, email } = user; 

  // before("Login into the application", () => {
  //   cy.fixture("urls.json").as("url")
  //   cy.get("@url").then((url) => {
  //       cy.visit(url.providerUrl)
  //   })
  //   cy.clearCookies()
  //   cy.clearLocalStorage()
  //   cy.providerLogin('cmpunk', 'Password1@')  
  //   cy.contains("Welcome").should("have.text", " Welcome To YOUR VIRTUAL CARE PLATFORM ")
  // })
it('Navigate to the admin panel', () => {
  cy.visit('https://testprac21.scxtest.net/pportal/#/payment/pay/_MHTVLWP2UWI4NoJIqHYkA')
  cy.iframe('.__PrivateStripeElement > iframe').within(() => {
    cy.get("input[name='cardnumber']").type('4111 1111 1111 1111')
    cy.get("input[name='exp-date']").type('0530')
    cy.get("input[name='cvc']").type('555')
    cy.get("input[name='postal']").type('55555')
}) 
  // cy.providerLogin('cmpunk', 'Password1@')
  // cy.get("a[routerlink='patients/list']").click()
  // cy.get(':nth-child(1) > .text-right > .patient-action > .blue').click()
  // cy.get("label[for='browserJoin']").click()
  //   cy.clearCookies()
  //   cy.clearLocalStorage()
  //   cy.contains("Login").click()
  //   cy.get('#Username').type("cmpunk")
  //         cy.get('#Password').type('Password1@')
  //         cy.get("button[value='login']").click()
  //         cy.get("a[routerlink='patients/list']").click()
  //         cy.get('tbody tr:nth-child(2) td:nth-child(13) span:nth-child(1)').click()
  //         cy.get("div[class='col-md-12 mb-3'] div:nth-child(2)").click()
  //         cy.get(".btn.btn-md.btn-success.mr-2").click()
  //         cy.iframe('#braintree-hosted-field-number').within(() => {
  //           cy.get('#credit-card-number').type('4111 1111 1111 1111')
  //         })

  //           cy.get('#braintree-hosted-field-number').type('4111 1111 1111 1111')
  //     cy.get("span[class*='user-name'] span[class$='text']").click()
  //     cy.get("li:nth-child(4) a:nth-child(1) span:nth-child(2)").click()
  //     cy.get("li:nth-child(4) a span").click()
  //     cy.wait(3000)
})

  // it("Create and verify a new provider user", () => {
  //   cy.get(".merge-sty button").click()
  //   cy.get("input[placeholder='First Name here...']").type(firstName)
  //   cy.get("input[placeholder='Last Name here...']").type(lastName)
  //   cy.get("input[placeholder='Email Address here...']").type(email)
  //   cy.get("[formcontrolname=gender] span[class*=p-dropdown-trigger-icon]").click()
  //   cy.get("li[aria-label='Male']").click()
  //   cy.get("[formcontrolname=userRole] span[class*=p-dropdown-trigger-icon]").click()
  //   cy.get("li[aria-label='Provider']").click()
  //   cy.get("button[class*=p-datepicker-trigger] svg").click()
  //   cy.get("[class*=p-datepicker-year]").select('1998')
  //   cy.get("[class*=p-datepicker-month]").select('July')
  //   cy.get("[class*=p-datepicker-calendar] tbody tr td span").contains('17').click()
  //   cy.get(".p-accordion-toggle-icon").eq(1).click()
  //   cy.get('.btn-warning-light').selectFile('D:\\SmartClinix\\cypress\\fixtures\\sample.jpg')
  //   cy.get('.uploadImg-providerProfileImgNameControl > #providerProfileImgNameControl').should('have.attr', 'src').and('contains', 'data:image/jpeg')
  //   cy.get("input[formcontrolname='totalExperience']").type('7 years')
  //   cy.get(".p-multiselect-label").click()
  //   cy.get("input[role='textbox']").type('eng')
  //   cy.get(".p-multiselect-items-wrapper > ul").each( $txt => {
  //     if($txt.text().includes('English' )) {
  //       cy.wrap($txt).click()
  //     }
  //   })
  //   cy.get("input[formcontrolname='specialityTitle']").click({force:true}).type("ENT Specialist")
  //   cy.get('#p-accordiontab-3 > .p-accordion-toggle-icon').click()
  //   cy.get("input[placeholder='Search Taxonomy']").type('phy')
  //   cy.get(".p-autocomplete-panel > ul > li > span").each( $el => {
  //      if($el.text() === 'Allergy Physician' ) {
  //       cy.wrap($el).click() 
  //     }
  //   })
  //   cy.get(".p-datatable-wrapper > table > tbody >tr ").should("have.length", 2)
  //   cy.get("button[type='submit']").click()
  //   cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", firstName + ' ' + lastName)
  // })

  // it("Account verification via email", () => {
  //   cy.get("tbody tr:nth-child(1) td:nth-child(8) span:nth-child(1)").click()
  //   cy.get("div[role=dialog] > div[class*=p-dialog-footer] > p-footer > div > span:nth-child(1)").click()
  //   cy.get('.p-toast-summary').should('have.text', 'success')
  //   cy.get("tbody tr:nth-child(1) td:nth-child(6)").should("have.text", 'Pending')
  
  //   cy.mailosaurGetMessage(serverID, {sentTo: email}).then(($email) => {
  //     expect($email.subject).to.equal('Send Login Activation')
  //     let setUser = $email.html.links[0].href
  //     cy.visit(setUser)
  //   })
  // })

  // it("Create user Credentials", () => {
  //   cy.get("input[type='text']").type(lastName)
  //   cy.get("input[class*='p-password-input']").eq(0).type(password)
  //   cy.get("input[class*='p-password-input']").eq(1).type(password)
  //   cy.wait(3000)
  //   cy.get("button[class$=btn-blue]").click()   
  // })

  // it("Login into the new user account", ()=> {
  //   cy.clearCookies()
  //   cy.clearLocalStorage()
  //   cy.providerLogin(lastName, password)
  //   cy.get('.user-name > .text').should("have.text", firstName + ' ' + lastName+ ' ')
  // })

// })

// Sample code toverify retrive time within ranges

// it("Booking an appointment", () => {
//   cy.get('[class="last-activity-time"]').first().invoke('text').then((text) => {
//       const displayedTime = moment(text.trim(), "HH:mm A");

//       // Check if the displayed time is exactly equal to the expected time
//       if (displayedTime.isSame(moment(activityTime, "HH:mm A"))) {
//           expect(displayedTime.isSame(moment(activityTime, "HH:mm A"))).to.be.true;
//       } else {
//           // If not, check if it falls within the expected time range
//           const lowerBound = moment().utcOffset(-5).subtract(1, 'minutes');
//           const upperBound = moment().utcOffset(-5).add(1, 'minutes');
//           expect(displayedTime.isBetween(lowerBound, upperBound)).to.be.true;
//       }
//   });
})