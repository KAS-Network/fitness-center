function getFormData(form) {
  const body = {};

  const textInputList = form.querySelectorAll(".text-input");
  for (const input of textInputList) {
    body[input.name] = input.value === "" ? null : input.value;
  }

  const weekdayScheduleList = form.querySelectorAll(".weekday-schedule");
  body.schedule = {};
  for (const weekdaySchedule of weekdayScheduleList) {
    const weekday = weekdaySchedule.dataset.weekday;
    const inputFrom = weekdaySchedule.querySelector(`.time-input[name="${weekday}-from"]`);
    const inputTo = weekdaySchedule.querySelector(`.time-input[name="${weekday}-to"]`);
    body.schedule[weekday] = [inputFrom.value, inputTo.value];
  }

  const birthdateInput = form.querySelector(".date-input");
  if (birthdateInput) {
    let birthdate;
    try {
      birthdate = new Date(Date.parse(birthdateInput.value));
    } catch (err) {
      birthdate = new Date();
    }
    body[birthdateInput.name] = birthdate;
  }

  const genderInput = form.querySelector(".radio-input:checked");
  if (genderInput) {
    body[genderInput.name] = genderInput.value;
  }

  const selectList = document.querySelectorAll(".select");
  for (const select of selectList) {
    const selectedOption = select.querySelector(".select__option:checked");
    body[select.name] = selectedOption.value;
  }

  return body;
}

function getImgFormData(form) {
  const imgInput = form.querySelector(".img-input");
  const img = imgInput.files[0];
  if (img) {
    const fd = new FormData();
    fd.append("image", img);
    return fd;
  } else {
    return null;
  }
}

async function onCreationFormSubmit(submit) {
  submit.preventDefault();

  const form = submit.target;
  const info = getFormData(form);
  
  const targetUrl = window.location.href.replace(/\/create\/?/, "");

  const res = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(info)
  });

  const objectId = res.headers.get("Object-Id");

  const imgFormData = getImgFormData(form);
  if (imgFormData) {
    await fetch(`${targetUrl}/${objectId}/upload-image`, {
      method: "PATCH",
      body: imgFormData
    });
  }
  
  window.location.href = window.location.origin;
}

async function onEditingFormSubmit(submit) {
  submit.preventDefault();
  const form = submit.target;
  const info = getFormData(form);
  
  const targetUrl = window.location.href.replace(/\/edit\/?/, "");

  await fetch(targetUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(info)
  });

  const imgFormData = getImgFormData(form);
  if (imgFormData) {
    await fetch(`${targetUrl}/upload-image`, {
      method: "PATCH",
      body: imgFormData
    });
  }
  
  window.location.href = window.location.origin;
}