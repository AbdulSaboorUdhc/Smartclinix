
describe("Add Health Recrods of a Patient from Provider", ()=> {
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
    })

    it.skip("Adding a Vital Record", () => {
        cy.get('a span').contains("Vitals").click()
        cy.wait(4000)
        cy.get(".text-right .btn").should('be.visible').click()
        cy.wait(2000)
        cy.get("[placeholder='Systolic..'] input").type('131').should('have.value', '131')
        cy.get("[placeholder='Diastolic..'] input").type('90').should('have.value', '90')
        cy.get("[placeholder='Fahrenheit']").type('59').should('have.value', '59.0')
        cy.get("[placeholder='Percent'] input").type('66').should('have.value', '66')
        cy.get("[placeholder='Beats per minute'] input").type('100').should('have.value', '100')
        cy.get("[placeholder='Milligram/deciliter']").type('108').should('have.value', '108.0')
        cy.get("[placeholder='Pound']").type('91').should('have.value', '91.00')
        cy.get("[placeholder='centimeters']").eq(0).type('101').should('have.value', '101.00')
        cy.get("[placeholder='centimeters']").eq(1).type('176').should('have.value', '176')
        cy.get("[placeholder='Respiration per minute'] input").type('12').should('have.value', '12')
        cy.wait(2000)
        cy.get(".negative-top-vital .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Adding a Lab Results", () => {
        cy.wait(2000)
        cy.get('a span').contains("Results").click()
        cy.get('[type="button"]').contains("Add").click()
        cy.get(".card-view input[role='combobox']").type('vita')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "VITAMIN K") {
                cy.wrap(txt).click()
            }
        })    
        cy.get("#orderReference").type('01')    
        cy.get("#remarks").type('This is just a test result')
        cy.get("input[placeholder='Result']").eq(0).type(70)
        cy.contains(" Upload Reports ").click()
        cy.get(".p-fileupload-buttonbar input[type='file']").selectFile('D:\\SmartClinix\\cypress\\fixtures\\sample.jpg', {force: true})
        cy.get('.p-dialog-footer .btn-success').click().should('not.be.disabled')
        cy.get("input[placeholder='Search Diagnosis']").type('E561')
        cy.get("ul[role='listbox'] li").each(($ele) => {
            const text = $ele.find("span")
            const getDig = text.text()
            if(getDig === "(E561) Deficiency of vitamin K") {
                cy.wrap(text).click()
            }
        })
        cy.get(".same-width-item-120 .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it('Add Medicine into the Medications List', () => {
        cy.get('a').contains("Medications List").click()
        cy.wait(2000)
        cy.contains(/Add Medication/i).click()
        cy.get("input[placeholder='Search Medications']").type('isot')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find(".name-data")
            const getText = txt.text()
            if(getText === "Isotretinoin 10mg Capsule") {
                cy.wrap(txt).click()
            }
        })
        cy.get(".same-width-item-60 .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    // it('Add Allergies of a Patient by Searching directly', () => {
    //     cy.get('a').contains("Allergies").click()
    //     cy.contains("Add Allergies").click()
    //     cy.get("input[placeholder='Search..']").type('cig')
    //     cy.get("ul[role='listbox'] li").each(($el) => {
    //         const txt = $el.find("span")
    //         const getText = txt.text()
    //         if(getText === "Cigarette Smoke") {
    //             cy.wrap(txt).click()
    //         }
    //     })
    //     cy.get(".input-group-text").click()
    //     cy.contains("Itchy and watery eyes ").click().should("have.class", 'active')
    //     cy.get(".p-dialog-footer .btn-danger").click()
        
    //     cy.get(".heading-left-right .btn-success").click()
    //     cy.get('.p-toast-summary').should('contain.text', 'Success')
    // })

    it('Add Allergies of a Patient by selecting a category', () => {
        cy.get('a').contains("Allergies").click()
        cy.contains("Add Allergies").click()
        cy.contains("No known allergy").click()
        cy.get("input[placeholder='Search..']").should('be.disabled')
        cy.contains("No known allergy").click()
        cy.contains("Drug Allergy").click()
        cy.get("input[placeholder='Search..']").eq(1).type('alo')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "Aloe vera preparation") {
                cy.wrap(txt).click()
            }
        })
        cy.get(".input-group-text").click()
        cy.contains("Itchy and watery eyes ").click()
        cy.get(".p-dialog-footer .btn-danger").click()
        
        cy.get(".heading-left-right .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Adding a Past Medical History", () => {
        cy.get('a span').contains("Histories").click()
        cy.contains(/Add Medical History/i).click()
        cy.get("input[placeholder='Search Diagnosis']").type('vir')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("div:nth-child(2)")
            const getText = txt.text()
            if(getText === "Viral meningitis") {
                cy.wrap(txt).click({force:true})
            }
        })    
        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Adding a Past Surgical History", () => {
        // cy.get('a span').contains("Histories").click()
        cy.contains('Surgical History').click()
        cy.get('button').contains("Add").click()
        cy.get("input[placeholder='Search..']").type('bon')
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "Bone age studies") {
                cy.wrap(txt).click()
            }
        })    
        cy.get(".same-width-item-100 .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    it("Adding a Hospitalization Record", () => {
        //  cy.get('a span').contains("Histories").click()
        cy.contains('Hospitalization History').click()
        cy.contains(/Add hospitalization/i).click()
        cy.get("[placeholder='Hospitalization Reason']").type('cramps')
        cy.get("[placeholder='Hospital Name']").type('States Hospital')
        cy.get("#diagnosisFrmId ul [Placeholder='Search Diagnosis']").type("cram")
        cy.get("ul[role='listbox'] li").each(($el) => {
            const txt = $el.find("span")
            const getText = txt.text()
            if(getText === "(G4762) Sleep related leg cramps") {
                cy.wrap(txt).click()
            }
        })    
        cy.get(".text-right .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success')
    })

    // it("Adding a Family History by Searching", () => {
    //     //  cy.get('a span').contains("Histories").click()
    //     cy.contains('Family History').click()
    //     cy.wait(3000)
    //     cy.get('[type="button"]').contains('Family').click()
    //     cy.get("input[placeholder='Search..']").type('mig')
    //     cy.get("ul[role='listbox'] li").each(($el) => {
    //         const txt = $el.find('span')
    //         const getText = $el.text().trim()
    //         if(getText === "Migraine") {
    //             cy.wrap(txt).click()
    //         }
    //     })    
    //     cy.get('[role="dialog"]').contains("Uncle").click()
    //     cy.get("[class='btn btn-primary btn-sm']").click()

    //     cy.get(".d-flex .btn-success").click()
    //     cy.get('.p-toast-summary').should('contain.text', 'Success') 
    // })

    it("Adding a Family History by selecting a category", () => {
        cy.get('a span').contains("Histories").click()
        cy.contains('Family History').click()
        cy.wait(3000)
        cy.get('[type="button"]').contains('Family').click()
        cy.get("tr td label").each(($el) => {
            const getText = $el.text().trim()
            if(getText === "Insomnia") {
                cy.wrap($el).click()
            }
        })    
        cy.contains("Uncle").click()
        cy.get("[class='btn btn-primary btn-sm']").click()

        cy.get(".d-flex .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success') 
    })

    it("Adding a Social History of a Patient", () => {
        //  cy.get('a span').contains("Histories").click()
        cy.contains('Social History').click()
        cy.get('[type="button"]').contains('Social').click()
        cy.contains('Exercise').click()
        cy.get("tbody td .p-dropdown > span").eq(0).click()
        cy.get("ul[role='listbox'] li").find("span:contains('5 times per week')").click()
        cy.get("td .p-multiselect-label-container").click()
        cy.get(".p-multiselect-filter-container > .p-multiselect-filter").type('wei')
        cy.get(".p-multiselect-items-wrapper ul li").each( ($el) => {
            const txt = $el.find('span').eq(1)
            const text = txt.text().trim()
            if (text === 'Weightlifting') {
                cy.wrap(txt).click()
            }
        })
        cy.get("tbody td .p-dropdown > span").eq(1).click()
        cy.get("ul[role='listbox'] li").find("span:contains('Moderate')").click()

        cy.get(".text-right .btn-success").click()
        cy.get('.p-toast-summary').should('contain.text', 'Success') 
    })

})