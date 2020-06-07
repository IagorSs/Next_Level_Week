function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then( (res) => res.json() )
        .then( (states) => {
            for (const state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;                
            }
        });
}

populateUFs();

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]");
    const stateInput = document.querySelector("input[name=state]");

    const indexOfState = event.target.selectedIndex;
    stateInput.value = event.target.options[indexOfState].text;

    citySelect.innerHTML = `<option value>Carregando...</option>`;
    citySelect.disabled = true;

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${event.target.value}/municipios`;

    fetch(url)
        .then( (res) => res.json() )
        .then( (cities) => {
            citySelect.innerHTML = `<option value> Selecione a Cidade</option>`;
            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;                
            }

            citySelect.disabled = false;
        });
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities);


const itemsToCollect = document.querySelectorAll(".items-grid li");

for(const item of itemsToCollect ){
    item.addEventListener("click", handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event) {

    const itemLi = event.target;

    itemLi.classList.toggle("selected");

    const itemId = itemLi.dataset.id;

    const hasSelected = selectedItems.findIndex( (item) => item == itemId);

    if (hasSelected >= 0) {
        const filteredItems = selectedItems.filter(item => item != itemId);
        selectedItems = filteredItems;
    }
    else {
        selectedItems.push(itemId);
    }

    collectedItems.value = selectedItems;
}