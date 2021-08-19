let mySpends = [];
let valueInputWhere = '';
let valueInputHow = '';
let inputWhere = null;
let inputHow = null;
let indexEdit = null;
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

if (day < 10) day = `0${day}`
if (month < 10) month = `0${month}`
actualDate = `${day}.${month}.${year}`;

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
      const shopsCorrect = document.createElement('input');
      shopsCorrect.type = 'text';
      shopsCorrect.className = 'shopsCorrect'
      shopsCorrect.id = 'shopsCorrect';
      shopsCorrect.value = `${element.shop}`;
      container.appendChild(shopsCorrect);

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
        render();
      }

    } else {
      const inputShops = document.createElement('p');
      inputShops.innerText = `${index + 1}) Магазин "${element.shop}" ${actualDate}`;
      inputShops.className = 'dataBox-shop';
      container.appendChild(inputShops);

      const inputSpends = document.createElement('p');
      inputSpends.innerText = element.spend;
      inputSpends.className = 'dataBox-spends';
      container.appendChild(inputSpends);
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

  spendsCorrect = document.getElementById('spendsCorrect');
  spendsCorrect.addEventListener('change', addValueHow);
  mySpends[index].spend = spendsCorrect.value;

  const response = await fetch("http://localhost:8000/updateSpend", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      _id: mySpends[index]._id,
      shop: shopsCorrect.value,
      spend: spendsCorrect.value
    }),
  });
  const result = await response.json();
  mySpends = result.data;
  indexEdit = null;
  render();
}