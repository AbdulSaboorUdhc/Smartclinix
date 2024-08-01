import moment from 'moment';

describe('Appointment Scheduling and Booking', () => {
  function getMonthString(month) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month - 1];
  }
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; 
  const day = today.getDate();
  const formatedDay = String(day).padStart(2, '0')
  const formatedMonth = String(month).padStart(2, '0')
  const formattedDate = `${formatedMonth}/${formatedDay}/${year}`;
  
  const todayDay = today.getDay();

  const convertTo24HourFormat = (timeString, format) => {
    return moment(timeString, format).format('HH:mm:ss');
  };

  // const currentTime = moment().utcOffset(-5);
  // currentTime.startOf('day');
  // const fromTime = currentTime.format("hh:mm A");
  // const toTime = moment(fromTime, "HH:mm A").add(1, "hours").format("HH:00 A");
  const fromTime = '04:00 PM'
  const toTime = '05:00 PM'
  before("", () => {
    cy.fixture("urls.json").as("url")
    cy.get("@url").then((url) => {
        cy.visit(url.providerUrl)
    })
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.providerLogin('11alex', 'Password1@')  
    cy.get("a[routerlink='appointments/appointment-nav']").should('be.visible').click()
  })
    it('Schedule creation by provider', () => {
      cy.get(".p-tabview-nav-content li:nth-child(4) a").click()
      cy.get('#location-doc_5802').click()
      cy.get('.save-cancel-buttons > .btn').click()
      cy.get('[id="dateFromPrvBtn"] ~ .small-date-picker p-calendar').first()
      .as('fromCalendar');
      cy.get('[id="dateFromPrvBtn"] ~ .small-date-picker p-calendar').last()
      .as('toCalendar');
      cy.get('@fromCalendar').find('.p-datepicker-trigger').click();
      // cy.get('@fromCalendar').find('.p-datepicker-title').contains(year).click({force: true});
      // cy.get('@fromCalendar').find('.p-datepicker-title').contains(month).click({force: true});
      cy.get('@fromCalendar').find('.p-datepicker-calendar tbody td span').contains(day).click({force: true});
      cy.get('@toCalendar').find('.p-datepicker-trigger').click();
      // cy.get('@toCalendar').find('.p-datepicker-title').contains(year, { optional: true }).click({force: true});
      // cy.get('@toCalendar').find('.p-datepicker-title').contains(month).click({force: true});
      cy.get('@toCalendar').find('.p-datepicker-calendar tbody td span').contains(day).click({force: true});
      cy.get("@fromCalendar").find(".p-inputtext").should('have.value', formattedDate)
      cy.get("@toCalendar").find(".p-inputtext").should('have.value', formattedDate)

      cy.get('.same-width-item-80 > .btn').click()
      cy.get('.dateTimeField').first().clear().type(fromTime)
      cy.get('.dateTimeField').last().clear().type(toTime)

      cy.get('.btn-group-toggle .btn').each(($dayLabel) => {
        const dayText = $dayLabel.text().trim()
        if (dayText.toLowerCase() === ["mon", "tue", "wed", "thu", "fri", "sat", "sun"][todayDay - 1]) {
            cy.wrap($dayLabel.find('input[type="checkbox"]')).click({force: true} );
            cy.get('.btn-group-toggle .btn').eq([todayDay - 1]).find('input[type="checkbox"]').should('be.checked');
          return false;
        }
      });
      cy.get('.btn-success-light').click()
      cy.get('.p-tabview-nav-content li:nth-child(2) a').click()
      cy.get('#location-doc_5802').click()
      cy.wait(3000)
      cy.get('td .btn').last().click()

      // const fromTime24 = convertTo24HourFormat(fromTime, 'hh:mm:ss A');
      // const toTime24 = convertTo24HourFormat(toTime, 'hh:mm:ss A');
      cy.get(".date-time-container .p-dropdown-label").should('have.text', fromTime + '-' + toTime)
    })

    it("Book an appointment for patient", () => { 
      cy.contains("Add Appointment ").first().click()
      cy.get(".p-autocomplete [placeholder='Search Patients']", { timeout: 3000 }).eq(1).type('roman');
      cy.get(".p-autocomplete-items li").each($el => {
      const nameElement = $el.find(".patient-name-cell .name")
      const nameText = nameElement.text().trim()
        if (nameText.includes('Roman Rollins')) {
          cy.wrap(nameElement).click()
        }
      })
    cy.get("[formcontrolname='billTypeProfileId'] .p-dropdown-trigger").click()
    cy.get(".p-dropdown-items-wrapper").contains("Cash Based").click()
    cy.get("#splCheck1").check({force:true})
    cy.get(".p-float-label > [formcontrolname='visitReason']").type("This is just a random checkup.")
    cy.get(".p-dialog-footer .btn.btn-success").click()
    cy.wait(4000)
    cy.get("tr td").each(el => {
      const patientElement = el.find(".patient-name")
      const patientText = patientElement.text().trim()
      if (patientText.includes("Roman Rollins")) {
        expect(patientText).to.contain("Roman Rollins")
      }
    })
  })
})
