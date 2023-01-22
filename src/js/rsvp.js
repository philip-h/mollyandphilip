// Get all relevant Dom elements
const checkEmailButton = document.getElementById("checkEmailButton");
const emailInput = document.getElementById("email_in");
const errorMessage = document.querySelector(".form-item__error");
const emailCheckForm = document.querySelector(".check-email-container");
const rsvpForm = document.querySelector(".rsvp-form-container");
const rsvpFieldset = document.getElementById("rsvp-fieldset");
const rsvpButton = document.getElementById("rsvp-button");

// Prevent default from form
document.getElementById("email-form")
  .addEventListener("submit", e => e.preventDefault());

document.getElementById("rsvp-form")
  .addEventListener("submit", e => e.preventDefault());


function nameToCheckBox(fullName, rowId) {
  const fullNameSlug = fullName.replace(/ /g,'');
  const checkBox = document.createElement('input');
  checkBox.type="checkbox";
  checkBox.name="rsvp-names";
  checkBox.id=fullNameSlug;
  checkBox.value=rowId

  const label = document.createElement('label');
  label.htmlFor = fullNameSlug;
  label.innerText = fullName;

  const container = document.createElement('div');
  container.appendChild(checkBox);
  container.appendChild(label);

  return container;
}

async function submitRSVPForm() {
  // Grab all of the relevant data
  const checkBoxContainers = Array.from(rsvpFieldset.children);
  checkBoxContainers.shift();

  // Create the JSON object to update
  const records = []
  checkBoxContainers.forEach(checkBoxContainer => {
    const elements = Array.from(checkBoxContainer.children);
    const canCome = elements[0].checked ? 'Yes' : 'No';
    const record = { 
      id: elements[0].value,
      fields: {
        "RSVPStatus": canCome,
        "SongRequest": document.getElementById("songreq").value
     }
    };
      records.push(record);
  });

  const data = {records};
  const url = new URL("https://api.airtable.com/v0/appsit6FuUaYaimD1/GuessTheList")
  console.log(JSON.stringify(data));
  const response = await fetch(url, { 
    headers: {
      'Authorization': 'Bearer key6D7xNIxuAPCWV6',
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(data)
    });

    if (!response.ok){
      alert("Error");
      console.log(response);
      return
    }

    window.location.replace("/thanks");

}

async function displayAndPopulateRSVP(records) {
  rsvpForm.style.display = "block";
  rsvpForm.classList.add("opacity-1");
  checkEmailButton.disabled = "true";
  console.log(records);

  records.forEach(record => {
    const fields = record.fields;
    const fullName = `${fields.FirstName} ${fields.LastName}`
    const checkbox = nameToCheckBox(fullName, record.id);
    rsvpFieldset.appendChild(checkbox);
  });

  rsvpButton.addEventListener('click', submitRSVPForm);

}

async function checkEmail() {
  // Do nothing is email is invalid (blank or browser supported email validation)
  if (!emailInput.validity.valid)
    return false

  const url = new URL("https://api.airtable.com/v0/appsit6FuUaYaimD1/GuessTheList")
  url.searchParams.append('filterByFormula', `{Email} = '${emailInput.value}'`)
  
  const response = await fetch(url, { headers: {'Authorization': 'Bearer key6D7xNIxuAPCWV6'}});
  if (!response.ok) {
    errorMessage.classList.add("opacity-1");
    return false
  }
  const json = await response.json()
  const records = json.records;
  if (records.length == 0) {
    errorMessage.classList.add("opacity-1");
    return false
  }
  errorMessage.classList.remove("opacity-1");
  displayAndPopulateRSVP(records)
}

// Instead, when we press submit, fetch name from given email address
checkEmailButton.addEventListener("click", checkEmail); 
