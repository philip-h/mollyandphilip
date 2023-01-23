// Get all relevant Dom elements
const checkEmailButton = document.getElementById("checkEmailButton");
const emailInput = document.getElementById("email_in");
const errorMessage = document.querySelector(".form-item__error");
const emailCheckForm = document.querySelector(".check-email-container");
const rsvpForm = document.querySelector(".rsvp-form-container");
const rsvpFieldset = document.getElementById("rsvp-fieldset");
const rsvpButton = document.getElementById("rsvp-button");
const loadingSpinner = document.querySelector('.loading')

// Prevent default from form
document.getElementById("email-form")
  .addEventListener("submit", e => e.preventDefault());

document.getElementById("rsvp-form")
  .addEventListener("submit", e => e.preventDefault());


function nameToCheckBox(fullName, rowId) {
  const fullNameSlug = fullName.replace(/ /g,'');

  const nameSpan = document.createElement('span')
  nameSpan.innerText = fullName+ ":";
  nameSpan.style.marginRight = "1rem";

  const checkBoxContainer = document.createElement('div');

  const checkBoxYes = document.createElement('input');
  checkBoxYes.type="radio";
  checkBoxYes.name=`rsvp-${fullNameSlug}`;
  checkBoxYes.id=fullNameSlug+"Yes";
  checkBoxYes.value=rowId
  
  const checkBoxNo = document.createElement('input');
  checkBoxNo.type="radio";
  checkBoxNo.name=`rsvp-${fullNameSlug}`;
  checkBoxNo.id=fullNameSlug+"No";
  checkBoxNo.value=rowId

  const labelYes = document.createElement('label');
  labelYes.htmlFor = fullNameSlug+"Yes";
  labelYes.innerText = "Yes";

  const labelNo = document.createElement('label');
  labelNo.htmlFor = fullNameSlug+"No";
  labelNo.innerText = "No";

  checkBoxContainer.append(checkBoxYes);
  checkBoxContainer.append(labelYes);
  checkBoxContainer.append(checkBoxNo);
  checkBoxContainer.append(labelNo);

  const container = document.createElement('div');
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  container.append(nameSpan);
  container.append(checkBoxContainer);

  return container;
}

async function submitRSVPForm() {
  // Grab all of the relevant data
  const rsvpYesNoContainer = Array.from(rsvpFieldset.children);
  // Remove legend
  rsvpYesNoContainer.shift();
  // Remove paragraph instructions
  rsvpYesNoContainer.shift();

  // Create the JSON object to update
  const records = []
  rsvpYesNoContainer.forEach(containerElementNodeList => {
    const containerElementArr = Array.from(containerElementNodeList.children);
    const yesNoDiv = containerElementArr.pop();
    const [yesRadio, , noRadio, ] = Array.from(yesNoDiv.children);
    let canCome = '';
    if (yesRadio.checked) {
      canCome = 'Yes';
    } else if (noRadio.checked) {
      canCome = 'No';
    } else {
      canCome = 'LeftBlank';
    }


    const record = { 
      id: yesRadio.value,
      fields: {
        "RSVPStatus": canCome,
        "SongRequest": document.getElementById("songreq").value
     }
    };
      records.push(record);
  });

  const data = {records};
  const url = new URL("https://api.airtable.com/v0/appsit6FuUaYaimD1/GuessTheList")
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
      console.log(response);
      return
    }

    window.location.replace("/thanks");

}

async function displayAndPopulateRSVP(records) {
  loadingSpinner.classList.remove('opacity-1')
  rsvpForm.style.display = "block";
  rsvpForm.classList.add("opacity-1");
  checkEmailButton.disabled = "true";

  records.forEach(record => {
    const fields = record.fields;
    const fullName = `${fields.FirstName} ${fields.LastName}`
    const checkbox = nameToCheckBox(fullName, record.id);
    rsvpFieldset.appendChild(checkbox);
  });

  rsvpButton.addEventListener('click', submitRSVPForm);

}

async function checkEmail() {
  loadingSpinner.classList.add('opacity-1')
  // Do nothing is email is invalid (blank or browser supported email validation)
  if (!emailInput.validity.valid){
    loadingSpinner.classList.remove('opacity-1')
    return false
  }

  const url = new URL("https://api.airtable.com/v0/appsit6FuUaYaimD1/GuessTheList")
  url.searchParams.append('filterByFormula', `LOWER({Email}) = '${emailInput.value.toLowerCase()}'`)
  
  const response = await fetch(url, { headers: {'Authorization': 'Bearer key6D7xNIxuAPCWV6'}});
  if (!response.ok) {
    errorMessage.classList.add("opacity-1");
    loadingSpinner.classList.remove('opacity-1')
    return false
  }
  const json = await response.json()
  const records = json.records;
  if (records.length == 0) {
    errorMessage.classList.add("opacity-1");
    loadingSpinner.classList.remove('opacity-1')
    return false
  }
  errorMessage.classList.remove("opacity-1");
  displayAndPopulateRSVP(records)
}

// Instead, when we press submit, fetch name from given email address
checkEmailButton.addEventListener("click", checkEmail); 
