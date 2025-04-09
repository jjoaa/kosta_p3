const api = 'B551182/spclMdlrtHospInfoService1/getChildNightMdlrtList1';
const auth = 'key';
const urlBase = 'https://apis.data.go.kr/' + api + '?serviceKey=' + auth +'&numOfRows='+30;

//지역 구분
function AreaCode(sigu, sido) {
    
    let urls = [];  // URL 배열 초기화
    let url ='';
    let DB='';

    if (sigu === '경기') {
        DB = DBGg;
        for (let i = 0; i < DB[sido].length; i++) {
            
            url = urlBase+'&sgguCd=' + DB[sido][i];
            urls.push(url); // 생성된 URL을 배열에 추가
            console.log(urls);
        }
    }
    else if (sigu ==='서울') {
        DB = DBSeoul;
        url = urlBase + '&sgguCd=' + DB[sido];
        urls.push(url);

    } else {
        DB = DBArea;
        url =  urlBase +'&sidoCd='+ DB[sigu];
        urls.push(url);
    }

    return urls; 
}

//main.js에 sendUrl함수에서 만든 mv클래스 파싱 함수
const mvPage = () => {
    const btn = document.querySelectorAll('.mv');

    btn.forEach((button, index) => {
        button.addEventListener('click', () => {
            const row = button.closest('tr');
            const hName = row.querySelector('.h-name').textContent; 
            const hAddr = row.querySelector('.h-addr').textContent; 
            const hTell = row.querySelector('.h-tell').textContent; 
            const hCode = row.querySelector('.h-code').textContent; 

            const hospitalInfo = {
                name: hName,
                addr: hAddr.split(',', 1),
                telno: hTell,
                code: hCode
            };
            goMap(hospitalInfo);
        });
    });
};

// url 전송
let sendUrl_list = function(sigu, sido) {
   
    const urls = AreaCode(sigu, sido); 
    const tableBody = $('#data-table tbody');     

    urls.map((url) => {
   
        axios.get(url)
            .then((res) => {
                const apiList = res.data.response.body.items.item; 

                // 병원 리스트가 배열인지 확인 (정상적인 경우에만 처리)
                if (Array.isArray(apiList)) {
                    // 주소에서 구 -> 군 -> 시 이름 기준으로 정렬
                    apiList.sort((a, b) => {
                        const guA = extractGuName(a.addr);
                        const guB = extractGuName(b.addr);
                    
                        const priorityA = getRegionPriority(guA);
                        const priorityB = getRegionPriority(guB);
                    
                        if (priorityA !== priorityB) {
                            return priorityA - priorityB;
                        }
                    
                        return guA.localeCompare(guB);
                    });
                               
                    apiList.forEach((H_info) => {
                        const row = $('<tr class="h-info">'); 

                        row.append('<td class="h-name">' + H_info.yadmNm + '</td>'); 
                        row.append('<td class="h-addr">' + H_info.addr + '</td>');
                        row.append('<td class="h-tell">' + H_info.telno + '</td>');
                        row.append('<td class="h-code">' + H_info.clCdNm + '</td>');
                        row.append('<td><button class="mv">지도</button></td>');

                        tableBody.append(row); 

                        row.find('.mv').on('click', () => {

                            const hospitalInfo = {
                                name: H_info.yadmNm,
                                addr: H_info.addr,
                                telno: H_info.telno,
                                code: H_info.clCdNm
                            };
                            goMap(hospitalInfo); 
                        });
                    });
                }
            })
            .catch((error) => {
                console.error('API 요청 중 오류가 발생했습니다: ', error);
            });
    });
};

function getRegionPriority(name) {
    if (name.endsWith('구')) return 1;  
    if (name.endsWith('군')) return 2;
    if (name.endsWith('시')) return 3;   
    return 4; 
}

// ✨ 주소에서 구 | 군 | 시 이름을 추출하는 함수
function extractGuName(address) {
    const match = address.match(/([가-힣]+(구|군|시))/);
    return match ? match[1] : '';
}


function goMap(hospitalInfo) {

    localStorage.setItem("hospital",JSON.stringify(hospitalInfo));

    newWin = window.open('./oneMap.html', '', 'width=600, height=500');
}


//지도
let addr;
let hospital;
let telno;
let code;


// 병원 정보 표시
const hospitalJson = localStorage.getItem("hospital");
if (!hospitalJson) {
    document.body.innerHTML = "<h2 style='text-align:center;'>병원 정보가 없습니다.</h2>";
  
} else {
    const hospitalInfo = JSON.parse(hospitalJson);
    
    addr = hospitalInfo.addr;
    hospital = hospitalInfo.name;
    telno = hospitalInfo.telno;
    code = hospitalInfo.code;

    document.getElementById('hospital-name').textContent = hospital;
    document.getElementById('hospital-addr').textContent = addr;
    document.getElementById('hospital-telno').textContent = telno;
    document.getElementById('hospital-code').textContent = code;

    localStorage.removeItem("hospital");
}

let mapContainer = document.getElementById('map'), 
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), 
        level: 3 
    };


let map = new kakao.maps.Map(mapContainer, mapOption);
let geocoder = new kakao.maps.services.Geocoder();

geocoder.addressSearch(addr , function(result, status) {

     if (status === kakao.maps.services.Status.OK) {

        let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 위치 마커표시
        let marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        //장소 설명표시
        let infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">'+hospital+'</div>'
        });
        infowindow.open(map, marker);

        map.setCenter(coords);
    } 
});    
