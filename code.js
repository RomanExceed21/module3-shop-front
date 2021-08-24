let mySpends = [];
let valueInputWhere = '';
let valueInputHow = '';
let inputWhere = null;
let inputHow = null;
let indexEdit = null;
let shopEdit = null;
let dateEdit = null;
let spendEdit = null;
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
const year = date.getFullYear();

if (day < 10) day = `0${day}`
if (month < 10) month = `0${month}`
actualDate = `${year}-${month}-${day}`;

window.onload = init = async () => {
  inputWhere = document.getElementById('input-where');
  inputWhere.addEventListener('change', addValueWhere);

  inputHow = document.getElementById('input-how');
  inputHow.addEventListener('change', addValueHow);
  const response = await fetch("http://localhost:8000/mySpends", {
    method: "GET",
  });
  const result = await response.json();
  mySpends = result.data;
  render();
}

const addSales = async () => {
  if (!inputWhere.value || !inputHow.value) return alert('Please fill all fields')
  const response = await fetch("http://localhost:8000/createSpend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      shop: valueInputWhere,
      spend: valueInputHow,
      date: actualDate
    })
  });
  const result = await response.json();
  mySpends = result.data;
  
  inputWhere.value = '';
  inputHow.value = '';
  valueInputWhere = '';
  valueInputHow = '';
  render();
}

const render = () => {
  const content = document.getElementById('sales-input-block');
  let totalSumm = 0;
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  mySpends.forEach((element, index) => {
    const container = document.createElement('div');
    container.className = 'dataBox';
    container.id = `dataBox-${index}`

    if (indexEdit === index) {
      const shopsCorrectInput = document.createElement('input');
      shopsCorrectInput.type = 'text';
      shopsCorrectInput.className = 'shopsCorrect';
      shopsCorrectInput.id = 'shopsCorrect';
      shopsCorrectInput.value = element.shop;
      container.appendChild(shopsCorrectInput);

      const dateCorrect = document.createElement('input');
      dateCorrect.type = 'date';
      dateCorrect.className = 'dateCorrect';
      dateCorrect.id = 'dateCorrect';
      dateCorrect.value = element.date;
      container.appendChild(dateCorrect);

      const spendsCorrect = document.createElement('input');
      spendsCorrect.type = 'number';
      spendsCorrect.id = 'spendsCorrect';
      spendsCorrect.className = 'spendsCorrect';
      spendsCorrect.value = element.spend;
      container.appendChild(spendsCorrect);

      const saveButton = document.createElement('input');
      saveButton.type = 'image';
      saveButton.src = 'img/save.png';
      saveButton.className = 'button';

      saveButton.onclick = () => {
        saveCorrections(index);
      }
      container.appendChild(saveButton);

      const cancelButton = document.createElement('input');
      cancelButton.type = 'image';
      cancelButton.src = 'img/cancel.png';
      cancelButton.className = 'button';
      container.appendChild(cancelButton);

      cancelButton.onclick = () => {
        indexEdit = null;
        if (!shopsCorrect.value || !dateCorrect.value || !spendsCorrect.value) return alert('Please fill all fields')
        render();
      }

    } else {

      if (shopEdit === index) {
        const shopsCorrectInput = document.createElement('input');
        shopsCorrectInput.type = 'text';
        shopsCorrectInput.className = 'shopsCorrect';
        shopsCorrectInput.id = 'shopsCorrect';
        shopsCorrectInput.value = element.shop;
        container.appendChild(shopsCorrectInput);
        shopsCorrectInput.focus();
        shopsCorrectInput.onblur = () => {
          saveCorrectionsDCShop(index);
          shopEdit = null;
        }    
      } else {
        const inputShops = document.createElement('p');
        inputShops.innerText = `${index + 1}) Магазин "${element.shop}"`;
        inputShops.className = 'dataBox-shop';
        inputShops.ondblclick = () => {
          render();
          shopEdit = index;
          dateEdit = null;
          spendEdit = null;
          render();
        }
        container.appendChild(inputShops);
      }

      if (dateEdit === index) {
        const dateCorrectInput = document.createElement('input');
        dateCorrectInput.type = 'date';
        dateCorrectInput.className = 'dateCorrect';
        dateCorrectInput.id = 'dateCorrect';
        dateCorrectInput.value = element.date;
        container.appendChild(dateCorrectInput);
        dateCorrectInput.focus();
        dateCorrectInput.onblur = () => {
          saveCorrectionsDCDate(index);
          dateEdit = null;
        }
      } else {
        const inputDate = document.createElement('p');
        inputDate.innerText = `${element.date}`;
        inputDate.className = 'dataBox-date';
        inputDate.ondblclick = () => {
          dateEdit = index;
          shopEdit = null;
          spendEdit = null;
          render();
        }
        container.appendChild(inputDate);
      }

      if (spendEdit === index) {
        const spendsCorrectInput = document.createElement('input');
        spendsCorrectInput.type = 'text';
        spendsCorrectInput.className = 'spendsCorrect';
        spendsCorrectInput.id = 'spendsCorrect';
        spendsCorrectInput.value = element.spend;
        container.appendChild(spendsCorrectInput);
        spendsCorrectInput.focus();
        spendsCorrectInput.onblur = () => {
          saveCorrectionsDCSpends(index);
          spendEdit = null;
        }
      } else {
        const inputSpends = document.createElement('p');
        inputSpends.innerText = `${element.spend} р.`;
        inputSpends.className = 'dataBox-spends';
        inputSpends.ondblclick = () => {
          spendEdit = index;
          dateEdit = null;
          shopEdit = null;
          render();
        }
        container.appendChild(inputSpends);
      }
    }
    
    const editButton = document.createElement('input');
    editButton.type = 'image';
    editButton.className = 'button';
    editButton.src = 'img/edit.png';

    editButton.onclick = () => {
      editSpend(index);
    };
    if (indexEdit !== index) container.appendChild(editButton);

    const dellButton = document.createElement('input');
    dellButton.type = 'image';
    dellButton.className = 'button';
    dellButton.src = 'img/del.png'
    if (indexEdit !== index) container.appendChild(dellButton);

    dellButton.onclick = () => {
      deleteSpend(index);
    };

    content.appendChild(container);

    totalSumm += Number(element.spend);
    inputTotal = document.getElementById('total-summ');
  });
  inputTotal.value = `Итого: ${totalSumm} р.`;
}

const addValueWhere = (event) => {
  valueInputWhere = event.target.value;
};

const addValueDate = (event) => {
  valueInputDate = event.target.value;
};

const addValueHow = (event) => {
  valueInputHow = event.target.value;
};

const deleteSpend = async (index) => {
  const response = await fetch(`http://localhost:8000/deleteSpend?_id=${mySpends[index]._id}`, {
      method: "DELETE",
    });
  const result = await response.json();
  mySpends = result.data;
  render();
}

const editSpend = (index) => {
  indexEdit = index;
  render();
}

const saveCorrections = async (index) => {
  shopsCorrect = document.getElementById('shopsCorrect');
  shopsCorrect.addEventListener('change', addValueWhere);
  mySpends[index].shop = shopsCorrect.value;

  dateCorrect = document.getElementById('dateCorrect');
  dateCorrect.addEventListener('change', addValueDate);
  mySpends[index].date = dateCorrect.value;

  spendsCorrect = document.getElementById('spendsCorrect');
  spendsCorrect.addEventListener('change', addValueHow);
  mySpends[index].spend = spendsCorrect.value;

  if (!shopsCorrect.value || !dateCorrect.value || !spendsCorrect.value) return alert('Please fill all fields')

  const response = await fetch("http://localhost:8000/updateSpend", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      _id: mySpends[index]._id,
      shop: shopsCorrect.value,
      spend: spendsCorrect.value,
      date: dateCorrect.value
    }),
  });
  const result = await response.json();
  mySpends = result.data;
  indexEdit = null;
  render();
}

const saveCorrectionsDCShop = async (index) => {
  shopsCorrect = document.getElementById('shopsCorrect');
  shopsCorrect.addEventListener('change', addValueWhere);
  mySpends[index].shop = shopsCorrect.value;

  if (!shopsCorrect.value) return alert('Please fill all fields')

  const response = await fetch("http://localhost:8000/updateSpend", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      _id: mySpends[index]._id,
      shop: shopsCorrect.value
    }),
  });
  const result = await response.json();
  mySpends = result.data;
  shopEdit = null;
  render();
}

const saveCorrectionsDCDate = async (index) => {
  dateCorrect = document.getElementById('dateCorrect');
  dateCorrect.addEventListener('change', addValueDate);
  mySpends[index].date = dateCorrect.value;

  if (!dateCorrect.value) return alert('Please fill all fields')

  const response = await fetch("http://localhost:8000/updateSpend", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      _id: mySpends[index]._id,
      date: dateCorrect.value
    }),
  });
  const result = await response.json();
  mySpends = result.data;
  dateEdit = null;
  render();
}

const saveCorrectionsDCSpends = async (index) => {
  spendsCorrect = document.getElementById('spendsCorrect');
  spendsCorrect.addEventListener('change', addValueHow);
  mySpends[index].spend = spendsCorrect.value;

  if (!spendsCorrect.value) return alert('Please fill all fields')

  const response = await fetch("http://localhost:8000/updateSpend", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      _id: mySpends[index]._id,
      spend: spendsCorrect.value
    }),
  });
  const result = await response.json();
  mySpends = result.data;
  spendEdit = null;
  render();
}