/// <reference types ="cypress" />

describe("Checking Export Functinality of RPM deatail Page", () => {
    let bearerToken;
    const apiEndpoint = 'https://api-gateway.scxtest.net/api/ehr/Rpm/RpmPatientDetailReport/Generate';
    const requestBody = {
        "enrollmentDate": "2024-02-28T00:00:00",
        "rpmBillingIdForVitals": 353931,
        "rpmBillingIdForTimeLog": 353931,
        "patientName": "Roman Rollins",
        "devicesName": "",
        "patientPhone": "+1 234-567-8900",
        "dateOfBirth": "1996-11-06T00:00:00",
        "gender": "Male",
        "measurmentDays": 0,
        "totalReviewTime": null,
        "totalInteractiveTime": null,
        "providerName": "Cm Punk",
        "diagnosisCode": null,
        "productCode": "99453",
        "billingStatus": "Pending",
        "lastBilledDate": null,
        "rpmConsentStatus": "Draft",
        "careManagers": null,
        "reportTypeProfileId": 9851,
        "totalRpmChartRows": 50,
        "currentRpmChartPage": 1,
        "primaryDiagnosis": null,
        "rpmBillStartDate": "2024-02-28T00:00:00"
    };

    before(() => {
        cy.fixture("urls.json").as("url")
        cy.get("@url").then((url) => {
            cy.visit(url.providerUrl)
        }) 
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.providerLogin("cmpunk", "Password1@")

        cy.intercept('POST', 'https://testprac21.scxtest.net/idsvr/connect/token').as('getToken');
        cy.wait('@getToken').then((interception) => {
            const responseBody = interception.response.body;
            bearerToken = responseBody.access_token;
        });
        
        cy.get("a[routerlink='/rpm']").click()
        cy.get("ul li:nth-child(2) .p-tabview-nav-link").click()
    })

    it("Export RPM Detail page", () => {
        cy.get("[datakey='rpmEnrollmentId'] tbody tr td:last-child span:nth-child(2)").first().click()
        cy.wait(2000)
        cy.get(".btn-danger-light").click()
        cy.wait(2000)
        cy.request({
            method: 'POST',
            url: apiEndpoint,
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'content-type': 'application/json',
                'customtimezone': 'Eastern Standard Time',
            },
            body: requestBody
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.include('RpmPatientDetail');
        });
    })
})
