
describe("Add Health Recrods of a Patient", ()=> {

    before("" , () => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.patientUrl)
        })
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.wait(2000)
        cy.contains("Login").click()
        cy.patientLogin('rrollins', 'Password1@')
        cy.wait(2000)
        cy.contains('Health Record').click()
    })

    it.skip("Adding a Vital Record", () => {
        cy.wait(4000)
        cy.get(".page-heading-block .btn").click()
        cy.wait(2000)
        cy.get("[placeholder='Systolic..'] input").type('51').should('have.value', '51')
        cy.get("[placeholder='Diastolic..'] input").type('71').should('have.value', '71')
        cy.get("[placeholder='Fahrenheit']").type('59').should('have.value', '59.0')
        cy.get("[placeholder='Percent'] input").type('66').should('have.value', '66')
        cy.get("[placeholder='Beats per minuts'] input").type('100').should('have.value', '100')
        cy.get("[placeholder='Milligram/deciliter']").type('108').should('have.value', '108.0')
        cy.get("[placeholder='Pound']").type('91').should('have.value', '91.00')
        cy.get("[placeholder='centimeters']").eq(0).type('101').should('have.value', '101.00')
        cy.get("[placeholder='centimeters']").eq(1).type('176').should('have.value', '176')
        cy.get("[placeholder='Respiration per minuts'] input").type('12').should('have.value', '12')
        cy.wait(2000)
        cy.get(".negative-top-vital .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Adding a Lab Results", () => {
        cy.get("a[routerlink='lab-results']").click()
        cy.contains("Add").click()
        cy.get("input[placeholder='Search...']").type('ace')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "ACETONE") {
                cy.wrap(txt).click()
            }
        })    
        cy.get("#orderReference").type('01')    
        cy.get("#remarks").type('This is just a test result')
        cy.get("input[placeholder='Result']").type(70) 
        cy.contains(" Upload Reports ").click()
        cy.get("input[type='file']").selectFile('D:\\SmartClinix\\cypress\\fixtures\\sample.jpg', {force: true})
        cy.get('.p-dialog-footer .btn-success').click().should('not.be.disabled')
        cy.get("input[placeholder='Search Diagnosis']").type('Z013')
        cy.get("ul[role='listbox'] li").each(($ele) => {
            const text = $ele.find("span")
            const getDig = text.text()
            if(getDig === "(Z013) Encounter for examination of blood pressure") {
                cy.wrap(text).click()
            }
        })
        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it('Add Medicine into the Medications List', () => {
        cy.get("a[routerlink='medications-list']").click()
        cy.wait(2000)
        cy.contains("Add").click()
        cy.get("input[placeholder='Search medication']").type('sels')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "Selsun Blue Maximum Strength Medicated Dandruff Shampoo") {
                cy.wrap(txt).click()
            }
        })
        cy.get(".text-right .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    // it('Add Allergies of a Patient by selecting a category', () => {
    //     cy.get("a[routerlink='allergies']").click()
    //     cy.contains("Add Allergies").click()
    //     cy.get("input[placeholder='Search..']").type('cig')
    //     cy.get("ul[role='listbox'] li").each(($el) => {
    //         const txt = $el.find("span")
    //         const getText = txt.text()
    //         if(getText === "Cigarette Smoke") {
    //             cy.wrap(txt).click()
    //         }
    //     })
    //     cy.get(".pi.pi-ellipsis-v").click()
    //     cy.contains("Itchy and watery eyes ").click().should("have.class", 'active')
    //     cy.get(".p-dialog-footer .btn-danger").click()
        
    //     cy.get(".heading-left-right .btn-success").click()
    //     cy.get('.p-toast-summary').should('have.text', 'Success')
    // })

    it('Add Allergies of a Patient by Searching directly', () => {
        cy.get("a[routerlink='allergies']").click()
        cy.contains("Add Allergies").click()
        cy.contains("No known allergy").click()
        cy.get("input[placeholder='Search..']").should('be.disabled')
        cy.contains("No known allergy").click()
        cy.contains("Drug Allergy").click()
        cy.get("input[placeholder='Search..']").eq(1).type('asp')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "Aspirin") {
                cy.wrap(txt).click()
            }
        })
        cy.get(".pi.pi-ellipsis-v").click()
        cy.contains("Itchy and watery eyes ").click().should("have.class", 'active')
        cy.get(".p-dialog-footer .btn-danger").click()
        
        cy.get(".heading-left-right .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Adding a Past Medical History", () => {
        cy.get("a[routerlink='past-medical-history']").click()
        cy.contains("Add").click()
        cy.get("input[placeholder='Search..']").type('toxic')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "(A483) Toxic shock syndrome") {
                cy.wrap(txt).click()
            }
        })    
        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Adding a Past Surgical History", () => {
        cy.get("a[routerlink='past-surgical-history']").click()
        cy.contains("Add").click()
        cy.get("input[placeholder='Search..']").type('stom')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "Biopsy of stomach, by laparotomy") {
                cy.wrap(txt).click()
            }
        })    
        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Adding a Hospitalization Record", () => {
        cy.get("a[routerlink='hospitalizations']").click()
        cy.contains("Add").click()
        cy.get("[placeholder='Hospitalization Reason']").type('fever')
        cy.get("[placeholder='Hospital Name']").type('States Hospital')
        cy.get("#diagnosisFrmId ul [Placeholder='Search..']").type("fever")
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "(A010) Typhoid fever") {
                cy.wrap(txt).click()
            }
        })    
        cy.get(".text-right .btn-success").click()
        cy.get('.p-toast-summary').should('have.text', 'Success')
    })

    it("Adding a Family History by Searching", () => {
        cy.get("a[routerlink='family-history']").click()
        cy.wait(3000)
        cy.get('[type="button"]').contains('Family').click()
        cy.get("input[placeholder='Search Complaint']").type('mig')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find('span')
            const getText = $el.text().trim()
            if(getText === "Migraine") {
                cy.wrap(txt).click()
            }
        })    
        cy.contains("Uncle").click({force: true})
        cy.get("[class='btn btn-primary btn-sm']").click()

        cy.get(".page-heading-block .btn-success").click()
        cy.get('.p-toast-summary', {timeout:1000}).should('contain.text', 'Success') 
    })

    // it("Adding a Family History by selecting a category", () => {
    //     cy.get("a[routerlink='family-history']").click()
    //     cy.wait(3000)
    //     cy.get('[type="button"]').contains('Family').click()
    //     cy.get("tr td label").each(($el) => {
    //         const getText = $el.text().trim()
    //         if(getText === "Visual Disturbance") {
    //             cy.wrap($el).click()
    //         }
    //     })    
    //     cy.get('[role="radiogroup"]').contains("Uncle").click()
    //     cy.get("[class='btn btn-primary btn-sm']").click()

    //     cy.get(".page-heading-block .btn-success").click()
    //     cy.get('.p-toast-summary').should('contain.text', 'Success') 
    // })

    it("Adding a Social History of a Patient", () => {
        cy.get("a[routerlink='social-history']").click()
        cy.get('[type="button"]').contains('Social').click()
        cy.contains('Sleep Status').click()
        cy.get("tbody td .p-dropdown > span").eq(0).click()
        cy.get("ul[role='listbox'] li").find("span:contains('Inadequate sleep hygiene')").click()
        cy.get("tbody td > input").clear().type('8')
        cy.get("tbody td .p-dropdown > span").eq(1).click()
        cy.get("ul[role='listbox'] li").find("span:contains('Fair')").click()

        cy.get(".text-right .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success') 
    })

})