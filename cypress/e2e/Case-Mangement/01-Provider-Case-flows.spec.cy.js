/// <reference types = "cypress" />

import jsdom from 'jsdom';
import { getRandomUserData } from '../RandomDataGenration';

let inboxId
let emailAddress
let originalUrl
let firstName
let lastName
let token
const {JSDOM} = jsdom;

describe('Case Creation using provider portal', ()=> {
    let existingUserFname = "Roman"
    let existingUserLname = "Rollins"

    before('', ()=> {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.providerUrl)
        })
        originalUrl = cy.url()
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.providerLogin("cmpunk", "Password1@")
        cy.intercept('POST', 'https://testprac21.scxtest.net/idsvr/connect/token').as('getToken');
        cy.wait('@getToken').then((interception) => {
            const responseBody = interception.response.body;
            token = responseBody.access_token;
        });
    
        cy.get("a[routerlink='/cases/cases']").click()
        cy.get(".p-tabview-nav li:nth-child(2) a").click()
        cy.fixture("patientCred.json").then((patientCredConfig) => {
      
            if (patientCredConfig.generateRandomUser) {
              const user = getRandomUserData("case", "user");
                firstName = user.firstName;
                lastName = user.lastName;
            }
        })
    })

    it.skip('Creating a Case from an existing patient', ()=> {
        cy.get(".btn.pos-btn").click()
        cy.get(".row input[role='combobox']").type(existingUserFname)
        cy.get("ul[role='listbox'] li .patient-name-cell span").each(($sp) => {
           const searchText = $sp.text().trim()
           if(searchText.includes(existingUserFname +" "+ existingUserLname)) {
            cy.wrap($sp).click()
           }
        })
        cy.get("[placeholder='Select Service Type']").click()
        cy.get("ul[role='listbox'] li span").each(($st) => {
            const serviceType = $st.text().trim()
            if(serviceType === 'Video Consultation'){
                cy.wrap($st).click()
            }
        })
        cy.get("[placeholder='Select Specialty']").click()
        cy.get("ul[role='listbox'] li span").each(($s) => {
            const serviceType = $s.text().trim()
            if(serviceType === 'Mental Health'){
                cy.wrap($s).click()
            }
        })
        cy.get("textarea[formcontrolname='description']").type('Case creation from an existing user.')
        cy.get("input[type='checkbox'] ~ .custom-control-label").contains('All').click()
        cy.get("input[type='checkbox'] ~ .custom-control-label").contains('Vital').click()
        cy.get(".chatgpt-icon").first().click()
        cy.get(".text-center .btn-success").click()
        cy.get("editor > .mce-content-body").first().should(($el) => {
            expect($el.text().length).to.be.greaterThan(0)})
        cy.get(".text-right .btn.btn-success").click()
        cy.get("tbody tr td:nth-child(2) a ").contains(existingUserFname +" "+ existingUserLname)
        .closest('tr')
        .find("td:nth-child(6)")
        .should('include.text', 'Open')
    })

    it('Case creation by creating a new patient', ()=> {
        cy.get(".btn.pos-btn").click()
        cy.get(".input-group-text").click()
        cy.wait(2000)
        cy.get('[formcontrolname="firstName"]').type(firstName)   
        cy.get('[formcontrolname="lastName"]').type(lastName)
        cy.get('[formcontrolname="dateOfBirth"] .dateTimeField').click()
        cy.get(".p-datepicker-year").click()
        cy.get(".p-yearpicker-year").contains('2020').click()
        cy.get(".p-monthpicker-month").contains('Jun').click()
        cy.get('.p-datepicker-calendar td span').eq(17).click()
        cy.get('[formcontrolname="gender"]').click()
        cy.get('li[aria-label="Male"]').click()
        cy.wait(1000)
        cy.get('.p-dialog-content .text-right .btn-success').click()
        cy.get("[placeholder='Select Service Type']").click()
        cy.get("ul[role='listbox'] li span").each(($st) => {
            const serviceType = $st.text().trim()
            if(serviceType === 'Video Consultation'){
                cy.wrap($st).click()
            }
        })
        cy.get("[placeholder='Select Specialty']").click()
        cy.get("ul[role='listbox'] li span").each(($s) => {
            const serviceType = $s.text().trim()
            if(serviceType === 'Physical Therapy'){
                cy.wrap($s).click()
            }
        })
        cy.get("textarea[formcontrolname='description']").type('Case creation by creating a new user.')
        cy.get(".text-right .btn-success").click()
        cy.get(".patient-name-link").each($txt => {
            const patientName = $txt.text().trim()
       
             if (patientName === firstName +' '+ lastName) {
                expect(patientName).to.equal(firstName +' '+ lastName)    }
        })
    })

    it('Edit a case', () => {
        cy.get(".action-icon [ptooltip='Edit']").first().click()
        cy.get("textarea[formcontrolname='description']").clear().type('Case desc is updated.')
        cy.get("editor > .mce-content-body").type('i have added this summary by my self.')
        cy.get(".text-right .btn-success").click()
    })

    it('Assign case to manager', () => {
        cy.get(".action-icon [ptooltip='Tasks']").first().click({force:true})
        cy.get("ul li a span.p-menuitem-text").should('be.visible').first().click()
        cy.get("[placeholder='Select Manager']").click()
        cy.get(".doctors-list .name-section").eq(0).click()
        cy.get("input[formcontrolname='subject']").type('Case Assinged')
        cy.get(".p-dialog-footer .btn-send").click()
        cy.get("ul[role='tablist'] li:nth-child(5) a").click()
        cy.get("app-assigned-case-manager .one-doctor-listed .patient-name-link")
        .first()
        .contains(firstName +" "+ lastName)
        .closest('tr')
        .find("td:nth-child(6) div").then( ($txt) => {
            const text = $txt.text().trim()
            expect($txt).contain(text)
        })
    })

    it('Assign case for initial review', () => {
        cy.get(".action-icon [ptooltip='Assign Case']").first().click({force:true})
        cy.get("ul li a span[class*='p-menuitem-tex']").eq(1).click()
        cy.get("[placeholder='Select User']").click()
        cy.get(".doctors-list .name-section").eq(1).click()
        cy.get(".doctors-list .name-section").eq(6).click()
        cy.get("input[formcontrolname='subject']").type('Case Assinged for initial review')
        cy.get(".p-dialog-footer .btn-send").click()
        cy.get("ul[role='tablist'] li:nth-child(6) a").click()
        cy.get("app-case-assigned-review .one-doctor-listed .patient-name-link")
        .first()
        .contains(firstName +" "+ lastName)
        .closest('tr')
        .find("td:nth-child(7) div").then( ($txt) => {
            const text = $txt.text().trim()
            expect($txt).contain(text)
        })
    })

    it('Assign case refferals', () => {
        cy.get(".action-icon [ptooltip='Assign Case']").first().click({force:true})
        cy.get("ul li a span[class*='p-menuitem-tex']").eq(3).click()
        cy.get("[placeholder='Select User']").click()
        cy.get(".doctors-list .name-section").eq(7).click()
        cy.get(".doctors-list .name-section").eq(9).click()
        cy.get("input[formcontrolname='subject']").type('Case Assinged for refferals')
        cy.get(".p-dialog-footer .btn-send").click()
        cy.get("ul[role='tablist'] li:nth-child(7) a").click()
    })

    it('Assign case for recommendations', () => {
        cy.get(".action-icon [ptooltip='Assign Case']").first().click({force:true})
        cy.get("ul li a span[class*='p-menuitem-tex']").eq(1).click()
        cy.get("[placeholder='Select User']").click()
        cy.get(".doctors-list .name-section").eq(10).click()
        cy.get(".doctors-list .name-section").eq(13).click()
        cy.get("input[formcontrolname='subject']").type('Case Assinged for recommendation')
        cy.get(".p-dialog-footer .btn-send").click()
        cy.get("ul[role='tablist'] li:nth-child(2) a").click()
        cy.get("tbody tr td:nth-child(2) a").contains(firstName +" "+ lastName)
        .closest('tr')
        .find("td:nth-child(6) div")
        .should("have.text", 'Assigned for Recommendation')
        cy.get("tbody tr td:nth-child(2) a")
        .first()
        .contains(firstName +" "+ lastName)
        .closest('tr')
        .find("td:nth-child(8) div").then( ($txt) => {
            const text = $txt.text().trim()
            expect($txt).contain(text)
        })
    })

    it('Add recommendations', () => {
        cy.get(".action-icon [ptooltip='Tasks']").first().click({force:true})
        cy.get("ul li a span[class*='p-menuitem-tex']").eq(5).click()
        cy.get('.tox-edit-area > iframe').then(($iframe) => {
            const iframeBody = $iframe.contents().find('body');
            cy.wrap(iframeBody).find('p').type('I am adding my recommendation.')
        })
        cy.get('.btn-send').click()
    }) 

    it('View and edit recommendation', () => {
        cy.get(".action-icon .cursor-pointer:nth-child(6)").first().click({force:true})
        cy.get("ul.p-menu-list li:nth-child(3) a").click()
        cy.get(".d-flex .btn").click()
        cy.get('.tox-edit-area > iframe').then(($iframe) => {
            const iframeBody = $iframe.contents().find('body');
            cy.wrap(iframeBody).find('p').as("container")
            cy.get("@container").clear()
            cy.get("@container").type("I have updated my recommendation")
        })
        
        cy.get(".d-flex .btn-success").click()
        cy.get('.p-dialog-header-close-icon').click()
    })

    it('Closing the case', () => {
        cy.get(".action-icon [ptooltip='Tasks']").first().click({force:true})
        cy.get("ul li a span[class*='p-menuitem-tex']").eq(6).click()
        cy.get(".p-confirm-dialog-accept").click()
        cy.get("tbody tr td:nth-child(2) a").contains(firstName +" "+ lastName)
        .closest('tr')
        .find("td:nth-child(6) div")
        .should("have.text", 'Closed')
    })

    it('Reopen a case', () => {
        cy.get("ul[role='tablist'] li:nth-child(8) a").click({force:true})
        cy.get("app-clossed-casas .one-doctor-listed .action-icon [ptooltip='Edit']").first().click()
        cy.get(".p-confirm-dialog-accept").click()
        cy.get("ul[role='tablist'] li:nth-child(2) a").click()
        cy.get("tbody tr td:nth-child(2) a").contains(firstName +" "+ lastName)
        .closest('tr')
        .find("td:nth-child(6) div")
        .should("have.text", 'Open')
    })

    it('Validate case history', () => {
        cy.get(".action-icon .cursor-pointer:nth-child(6)").first().click({force:true})
        cy.get("ul.p-menu-list li:nth-child(4) a").click()
        cy.get("div[role='dialog'] .p-datatable-table")
        .find(" tbody > tr > td:nth-child(2)")
        .then(($elements) => {
            const actualStatusValues = ['Open', 'Assigned to Case Manager', 'Assigned for Initial Review',
        'Assigned for Recommendation', 'Added Recommendation', 'Closed'];
        $elements.each(($el) => {
            if(typeof $el.text === 'function' && $el.text().trim()){
                cy.wrap($el).invoke('text').then((text) => {
                    actualStatusValues.push(text.trim());
                }) 
            }     
        })
            const expectedStatusValues = actualStatusValues;
            actualStatusValues.forEach(value => expect(expectedStatusValues).to.include(value));
        })
        cy.get(".p-dialog-header-icons .p-dialog-header-close").click()
    })

    it('Generate Payment Voucher and paying a case fee', () => {
        cy.get(".action-icon .cursor-pointer:nth-child(6)").first().click({force:true})
        cy.get("ul.p-menu-list li:nth-child(5) a").click()
        cy.contains("Payment Method").click()
        cy.get("ul li[role='option']").contains('Online').click()
        cy.mailslurp().then(mailslurp => mailslurp.createInbox()).then(inbox => {
            inboxId = inbox.id
            emailAddress = inbox.emailAddress
            cy.get('[formcontrolname="patientEmail"]').type(emailAddress)
        })
        cy.get('#patientMobileNumber').type('+12015555542')
        cy.contains("Payment Type").click()
        cy.get("ul li[role='option']").contains('Full Fee').click({force:true})
        cy.get("[formcontrolname='paymentAmount']").type('100')
        cy.contains("Select Speciality").click()
        cy.get("ul li[role='option']").contains('Gynecology Physician').click({force: true})
        cy.contains("Select Provider").click({force: true})
        cy.get("ul li[role='option']").contains('Cm Punk').click()
        cy.get(".text-center .btn-secondary").click()
        cy.mailslurp().then(mailslurp => {
            return mailslurp.waitForLatestEmail(inboxId, 30000, true);
        })
        .then(email => {
            expect(email.subject).to.contain("Payment for Second Opinion Service")
            const dom = new JSDOM(email.body);
            const link = dom.window.document.querySelector('a');
            if (link) {
            const activationLink = link.href;
            cy.visit(activationLink);
            return
            }
        })
        cy.iframe('.__PrivateStripeElement > iframe').within(() => {
            cy.get("input[name='cardnumber']").type('4111 1111 1111 1111')
            cy.get("input[name='exp-date']").type('0530')
            cy.get("input[name='cvc']").type('555')
            cy.get("input[name='postal']").type('55555')
        }) 
        cy.get("button").contains('Pay Now').click()
        cy.get(".text-center.color-dark").should('have.text', 'You have successfully paid your charges.')
        cy.go('back')
        cy.get(".p-tabview-nav li:nth-child(2) a").click()
        cy.get("tbody tr td:nth-child(10)").should('contain.text', 'Paid')
    })

    it('Validate case payment history', ()=> {
        cy.get(".action-icon .cursor-pointer:nth-child(6)").first().click({force:true})
        cy.get("ul.p-menu-list li:nth-child(6) a").click()
        cy.get(".p-dialog-content tbody tr td:nth-child(2)").siblings("td:nth-child(8)")
        .should('contain.text', 'Paid')
        cy.get('.p-dialog-header-close-icon').click()
    })

    it("Chat with others docs", () => {
        cy.get(".action-icon [ptooltip='Chat Panel']").first().click({force:true})
        cy.get(".chat-messenger .p-dropdown").click().find(".p-overlay ul :first-child li").click()
        cy.wait(2000)
        cy.get("[formcontrolname='txtMessageChat']").type("sample message")
        cy.get(".com-bar .icon ~ span").should('contain.text', 'Send').click({force: true})
        cy.get("#Uploaddd").click()
        cy.get(".upload-dd-item:nth-child(1)").click()
        cy.get(".p-fileupload-choose > input").selectFile('D:\\SmartClinix\\cypress\\fixtures\\sample.jpg', {force:true})
        cy.get(".p-dialog-footer .btn-primary").click()
    })

    it('View the case and verify details', () => {
        cy.get(".action-icon [ptooltip='View']").first().click({force: true})
        cy.get('div.d-flex.top-des.p-1') 
            .find('.des-item') 
            .each(($span, index) => { 
                const heading = $span.find('.heading').text(); 
                const detail = $span.find('.detail').text().trim(); 
  
                switch (index) {
                case 0:
                    expect(heading).to.equal('Case Manager');
                    if (detail === '') {
                        expect(detail).to.be.empty; 
                      } else {
                        expect(detail).to.not.be.empty; 
                      }
                    break;
                case 1:
                    expect(heading).to.equal('Locations');
                    expect(detail).to.equal(' Cypress Village ');
                    break;
                case 2:
                    expect(heading).to.equal('Service Requested');
                    expect(detail).to.equal('Video Consultation');
                    break;
                case 3:
                    expect(heading).to.equal('Status');
                    expect(detail).to.equal('Open');
                    break;
                default:
                    throw new Error(`Unexpected child span with index ${index}`);
                }
        })
    })

    it.skip('Checking Print Functionality of Case details Page', () => {
        const patientId = 41183;
        const patientCaseId = 979
        cy.get('.text-right > :nth-child(2)').click()
          
        cy.request({
        method: 'GET',
        url: `https://api-gateway.scxtest.net/api/ehr/Patient/${patientId}/PatientCases/${patientCaseId}/CaseManagementReportRDLC`,
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`,
            customtimezone: 'Eastern Standard Time',
        }
        }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.not.be.null
        expect(response.body).to.include('PatientCaseReport')
        })       
        cy.reload() 
    })

    it("Generate recommendation report", ()=> {
        cy.get(".text-right .btn-success").eq(0).click()
        cy.get("#testCheck60").click({force: true})
        cy.get('.tox-edit-area > iframe').eq(2).then($iframe => {
            const iframeBody = $iframe.contents().get(0);
            cy.wrap(iframeBody).get('body').type('this is a final recommendation.');
        })
        cy.get("#caseReview").click({force: true})
        cy.get('.tox-edit-area > iframe').eq(3).then(($iframe) => {
            const iframeBody = $iframe.contents().get(0);
            cy.wrap(iframeBody).get('body').type('this is the final review');
        })
        cy.get(".text-right .btn-success").click()
    })

    it("Checking Print Functinality of recommendation report", ()=> {
        cy.get('.text-right > :nth-child(2)').click()

        cy.request({
            method: 'GET',
            url: `https://api-gateway.scxtest.net/api/ehr/Patient/41183/PatientCases/979/CaseRecommendationReport`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                customtimezone: 'Eastern Standard Time',
            }
            }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null
            expect(response.body).to.include('PatientCaseReport')
        })
        cy.reload()
    })

    it("Case List Report genrate and export", ()=> {
        cy.get("ul[role='tablist'] li:nth-child(8) a").click()
        cy.get(".p-dropdown-items-wrapper :nth-child(2) span").click()
        cy.get('.small-text-field').first().click();
        cy.get('.p-datepicker-prev-icon').click();
        cy.get('.p-datepicker-calendar tbody td span').contains(/^1$/).click({force: true});
        cy.window().then(win => { cy.stub(win, 'open').as('open') }) 
        cy.get(".btn.btn-g-r").click()
        cy.get('@open').should('be.calledWithMatch', 'testprac21.scxtest.net') 

        cy.get(".btn.btn-e-e").click()
        cy.request({
            method: 'POST',
            url: `https://api-gateway.scxtest.net/api/ehr/Patient/PatientCases/RangeReports/Get`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                customtimezone: 'Eastern Standard Time',
            },
            body: {
                startDate: "2024-05-01T11:32:55",
                endDate: "2024-06-06T11:32:55",
                reportTypeProfileId: 9852,
                reportType: 11378,
                reportTitle: "Case List Report"
            }
            }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null
            expect(response.body).to.include('Reports')
        })
    })

    it("Provider Wise Report genrate and export", ()=> {
        cy.get("ul[role='tablist'] li:nth-child(8) a").click()
        cy.get(".p-dropdown-items-wrapper :nth-child(2) span").click()
        cy.contains("Provider wise Report").click()
        cy.get("#AllProvider").check({force:true})
        cy.get('.small-text-field').first().click();
        cy.get('.p-datepicker-prev-icon').click();
        cy.get('.p-datepicker-calendar tbody td span').contains(/^1$/).click();

        cy.window().then(win => { cy.stub(win, 'open').as('open') }) 
        cy.get(".btn.btn-g-r").click()
        cy.get('@open').should('be.calledWithMatch', 'testprac21.scxtest.net') 

        cy.get(".btn.btn-e-e").click()
        cy.request({
            method: 'POST',
            url: `https://api-gateway.scxtest.net/api/ehr/Patient/PatientCases/RangeReports/Get`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                customtimezone: 'Eastern Standard Time',
            },
            body: {
                startDate: "2024-05-01T11:32:55",
                endDate: "2024-06-06T11:32:55",
                reportTypeProfileId: 9852,
                reportType: 11381,
                reportTitle: "Provider wise Report"
            }
            }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null
            expect(response.body).to.include('Reports')
        })
    })

    it("Speciality Wise Report genrate and export", ()=> {
        cy.get("ul[role='tablist'] li:nth-child(8) a").click()
        cy.get(".p-dropdown-items-wrapper :nth-child(2) span").click()
        cy.contains("Specialty wise Report").click()
        cy.get("#select-all").check({force:true})
        cy.get('.small-text-field').first().click();
        cy.get('.p-datepicker-prev-icon').click();
        cy.get('.p-datepicker-calendar tbody td span').contains(/^1$/).click();

        cy.window().then(win => { cy.stub(win, 'open').as('open') }) 
        cy.get(".btn.btn-g-r").click()
        cy.get('@open').should('be.calledWithMatch', 'testprac21.scxtest.net') 

        cy.get(".btn.btn-e-e").click()
        cy.request({
            method: 'POST',
            url: `https://api-gateway.scxtest.net/api/ehr/Patient/PatientCases/RangeReports/Get`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                customtimezone: 'Eastern Standard Time',
            },
            body: {
                startDate: "2024-05-01T11:32:55",
                endDate: "2024-06-06T11:32:55",
                reportTypeProfileId: 9852,
                reportType: 11384,
                reportTitle: "Provider wise Report"
            }
            }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null
            expect(response.body).to.include('Reports')
        })
    })

    it("Location Wise Report genrate and export", ()=> {
        cy.get("ul[role='tablist'] li:nth-child(8) a").click()
        cy.get(".p-dropdown-items-wrapper :nth-child(2) span").click()
        cy.contains("Location wise Report").click()
        cy.get("#select-all").check({force:true})
        cy.get('.small-text-field').first().click();
        cy.get('.p-datepicker-prev-icon').click();
        cy.get('.p-datepicker-calendar tbody td span').contains(/^1$/).click();

        cy.window().then(win => { cy.stub(win, 'open').as('open') }) 
        cy.get(".btn.btn-g-r").click()
        cy.get('@open').should('be.calledWithMatch', 'testprac21.scxtest.net') 

        cy.get(".btn.btn-e-e").click()
        cy.request({
            method: 'POST',
            url: `https://api-gateway.scxtest.net/api/ehr/Patient/PatientCases/RangeReports/Get`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                customtimezone: 'Eastern Standard Time',
            },
            body: {
                startDate: "2024-05-01T11:32:55",
                endDate: "2024-06-06T11:32:55",
                reportTypeProfileId: 9852,
                reportType: 11382,
                reportTitle: "Provider wise Report"
            }
            }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null
            expect(response.body).to.include('Reports')
        })
    })

    it("Country Wise Report genrate and export", ()=> {
        cy.get("ul[role='tablist'] li:nth-child(8) a").click()
        cy.get(".p-dropdown-items-wrapper :nth-child(2) span").click()
        cy.contains("Country wise Report").click()
        cy.get('.one-doctor-listed > .custom-control').click()
        cy.get('.small-text-field').first().click();
        cy.get('.p-datepicker-prev-icon').click();
        cy.get('.p-datepicker-calendar tbody td span').contains(/^1$/).click();

        cy.window().then(win => { cy.stub(win, 'open').as('open') }) 
        cy.get(".btn.btn-g-r").click()
        cy.get('@open').should('be.calledWithMatch', 'testprac21.scxtest.net') 

        cy.get(".btn.btn-e-e").click()
        cy.request({
            method: 'POST',
            url: `https://api-gateway.scxtest.net/api/ehr/Patient/PatientCases/RangeReports/Get`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                customtimezone: 'Eastern Standard Time',
            },
            body: {
                startDate: "2024-05-01T11:32:55",
                endDate: "2024-06-06T11:32:55",
                reportTypeProfileId: 9852,
                reportType: 11383,
                reportTitle: "Provider wise Report"
            }
            }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null
            expect(response.body).to.include('Reports')
        })
    })

    it("Case Manager Wise Report genrate and export", ()=> {
        cy.get("ul[role='tablist'] li:nth-child(8) a").click()
        cy.get(".p-dropdown-items-wrapper :nth-child(2) span").click()
        cy.contains("Case Manager wise Report").click()
        cy.get('.one-doctor-listed > .custom-control > input').click({force:true})
        cy.get('.small-text-field').first().click();
        cy.get('.p-datepicker-prev-icon').click();
        cy.get('.p-datepicker-calendar tbody td span').contains(/^1$/).click();

        cy.window().then(win => { cy.stub(win, 'open').as('open') }) 
        cy.get(".btn.btn-g-r").click()
        cy.get('@open').should('be.calledWithMatch', 'testprac21.scxtest.net') 

        cy.get(".btn.btn-e-e").click()
        cy.request({
            method: 'POST',
            url: `https://api-gateway.scxtest.net/api/ehr/Patient/PatientCases/RangeReports/Get`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`,
                customtimezone: 'Eastern Standard Time',
            },
            body: {
                startDate: "2024-05-01T11:32:55",
                endDate: "2024-06-06T11:32:55",
                referenceIds: "10961",
                reportTypeProfileId: 9852,
                reportType: 11528,
                reportTitle: "Case Manager wise Report"
            }
            }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.be.null
            expect(response.body).to.include('Reports')
        })
    })
})  
