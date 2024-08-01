/// <reference types ="cypress" />

describe("PGHD Verification and Record Approval", () => {
    before("", () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.providerUrl)
        }) 
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.providerLogin("cmpunk", "Password1@")
        cy.wait(2000)
        cy.get("a[routerlink='patients/list']").click()
        cy.get(".search-user-control input[placeholder='Search Patients..']").eq(0).type('roman')
        cy.get(".patient-name-link").contains('Roman Rollins').should("be.visible")
        cy.get(".p-datatable-tbody .patient-name-cell .patient-name-link").each($el => {
            const nameText = $el.text().trim()
              if (nameText.includes('Roman Rollins')) {
                cy.wrap($el).click({force:true})
              }     
        }) 
        cy.wait(3000)
        cy.contains("PGHD").click()
    })

    it("Approved Vitals of a Patient", () => {
        cy.url().should('include', "/pghd-vital-sign")
        cy.contains("tbody tr td:nth-child(2)", '51/71').first().should('exist')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get("tbody tr:nth-child(1)").first().should('not.have.descendants', 'td:nth-child(13)')
    })

    it("Approved Results of a Patient", () => {
        cy.contains('Results').click()
        cy.contains("[class='listTitleName ng-star-inserted']", 'ACETONE').first().should('exist')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get(".top-header .list-action-icons").first().should('not.have.descendants', 'button[ptooltip="Approve"]')
    })

    it("Approved Medication of a Patient", () => {
        cy.contains('Medications').click()
        cy.contains("tbody tr td:nth-child(2) > .text-blue", 'Selsun Blue Maximum Strength Medicated Dandruff Shampoo').first().should('exist')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get("td:nth-child(6)").first().should('not.have.descendants', 'span[ptooltip="Approve"]')
    })

    it("Approved Allergies of a Patient", () => {
        cy.contains('Allergies').click()
        cy.contains("[class='order-section-heading color-blue']", 'Drug Allergy').first().should('exist')
        cy.contains("tbody tr td:nth-child(2)", 'Aspirin').first().should('exist')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get("td:nth-child(6)").first().should('not.have.descendants', 'span[ptooltip="Approve"]')
    })

    it("Approved Medical History of a Patient", () => {
        cy.contains('Medical History').click() 
        cy.contains("tbody tr td:nth-child(1)", 'Toxic shock syndrome').first().should('exist')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get("td:nth-child(5)").first().should('not.have.descendants', 'span[ptooltip="Approve"]')
    })

    it("Approved Surgical History of a Patient", () => {
        cy.contains('Surgical History').click() 
        cy.contains("tbody tr td:nth-child(2)", 'Biopsy of stomach, by laparotomy').first().should('exist')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get("td:nth-child(6)").first().should('not.have.descendants', 'span[ptooltip="Approve"]')
    })

    it("Approved Hospitalization Record of a Patient", () => {
        cy.contains('Hospitalization').click() 
        cy.contains("tbody tr td:nth-child(2)", 'fever').first().should('exist')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get("td:nth-child(7)").first().should('not.have.descendants', 'span[ptooltip="Approve"]')
    })

    it("Approved Family History of a Patient", () => {
        cy.contains('Family History').click() 
        cy.contains("tbody tr [class='condition-cell']", 'Migraine').first().should('exist')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get("td:nth-child(7)").first().should('not.have.descendants', 'span[ptooltip="Approve"]')
    })

    it("Approved Social History of a Patient", () => {
        cy.contains('Social History').click()
        cy.contains(".contact-heading .heading", 'Sleep Status').first().should('exist')
        cy.get('.field-label').contains('Status').first().siblings('.field-value').invoke('text').should('include', 'Inadequate sleep hygiene')
        cy.get("[ptooltip='Approve']").first().click()
        cy.get(".p-dialog-footer .btn-success").click()
        cy.get(".contact-heading .icon").first().should('not.have.descendants', 'span[ptooltip="Approve"]')
    })
})