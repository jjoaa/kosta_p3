//검색 목록 
window.onload = populateCities;

function updateDistricts() {
    const citySelect = document.getElementById("city");
    const districtSelect = document.getElementById("district");
    const selectedCity = citySelect.value;
   
    districtSelect.innerHTML = '';

    const districts = (selectedCity === '서울') ? Object.keys(DBSeoul) :
                      (selectedCity === '경기') ? Object.keys(DBGg) : [];

    if (selectedCity === '서울' || selectedCity === '경기') {
        createDistrictOption(districtSelect, '', '구를 선택하세요');
        districts.forEach(district => createDistrictOption(districtSelect, district, district));
        districtSelect.disabled = false;
    } else {
        createDistrictOption(districtSelect, '', '구를 선택할 수 없습니다');
        districtSelect.disabled = true;
    }
}

function createDistrictOption(selectElement, value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    selectElement.appendChild(option);
}


function populateCities() {
    const citySelect = document.getElementById("city");
    createCityOption(citySelect, '', '도시를 선택하세요');
    Object.keys(DBArea).forEach(city => createCityOption(citySelect, city, city)); 
}

function createCityOption(selectElement, value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    selectElement.appendChild(option);
}

// 리스트
function submit() {
    const citySelect = document.getElementById("city");
    const districtSelect = document.getElementById("district");

    const selectedCity = citySelect.value;
    const selectedDistrict = districtSelect.value;

    let sigu = selectedCity;  
    let sido = selectedDistrict ? selectedDistrict : ''; 

    //기존 데이터를 비움 처리 
    let tableBody = $('#data-table tbody');
    tableBody.empty();  

    //url 전송
    sendUrl_list(sigu, sido);
}


