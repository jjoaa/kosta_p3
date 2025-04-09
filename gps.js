//지도 초기화
let mapContainer = document.getElementById('map'), 
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), 
        level: 3 
    };
let map = new kakao.maps.Map(mapContainer, mapOption);
let geocoder = new kakao.maps.services.Geocoder();
let bounds = new kakao.maps.LatLngBounds(); 
let redmarker;
let markers = []; // 마커 배열로 초기화
let infowindows = []; // 인포윈도우도 배열로 초기화

// 검색
function first(){
    const citySelect = document.getElementById("city");
    const districtSelect = document.getElementById("district");

    const selectedCity = citySelect.value;
    const selectedDistrict = districtSelect.value;

    let sigu = selectedCity;  
    let sido = selectedDistrict ? selectedDistrict : ''; 

    // 기존 마커와 인포윈도우 제거
    removeMarker();
    bounds = new kakao.maps.LatLngBounds();
   
    //url 전송
    sendUrl_map(sigu, sido);
    document.getElementById("noData").style.display = "none"; 
}

function clickImage(){    
    document.querySelector('img').style.display = 'none';
    
    // 기존 마커와 인포윈도우 제거
    removeMarker();
    bounds = new kakao.maps.LatLngBounds();
    
    // GPS 사용
    if (navigator.geolocation) {
       
        navigator.geolocation.getCurrentPosition(function(position) {
            
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
            
            var locPosition = new kakao.maps.LatLng(lat, lon); 

      
             let icon = new kakao.maps.MarkerImage(
               "./images/gpsIcon.png",
                new kakao.maps.Size(40, 40)
            )
            
            redmarker = new kakao.maps.Marker({  
                map: map, 
                position: locPosition,
                image : icon
            }); 
           
            redmarker.setImage(icon);
                   
            let coord = new kakao.maps.LatLng(lat, lon);
            let callback = function(result, status) {
                if (status === kakao.maps.services.Status.OK) {

                    document.getElementById("map").style.display = "block"; 
                    map.relayout();

                    let sido = result[0].address.region_1depth_name;
                    let sigu = result[0].address.region_2depth_name;
                    sendUrl_map(sido, sigu);   
                                
                    map.setCenter(coord);   
                }
            };
            geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        });
    } else { //GPS 사용할 수 없을 경우
        
        document.getElementById("noGps").style.display = "block";  
        document.getElementById("noData").style.display = "block"; 
        document.getElementById("map").style.display = "none";    
        sendUrl_map(sigu, sido);  
    }
}

//공공 API
const api = 'B551182/spclMdlrtHospInfoService1/getChildNightMdlrtList1';
const auth = 'MJMD6kyAcwn4zDEcbqLnrUmxmTo4vK0BYwnE9DtEA%2FyqKFmuGzDaRAV7RNTIH4BX1aZ9ujBOdLHeFmEhO%2FGcIA%3D%3D';
const urlBase = 'https://apis.data.go.kr/' + api + '?serviceKey=' + auth +'&numOfRows='+30;


function AreaCode(sigu, sido) {

    let urls = [];  
    let url ='';
    let DB='';

    if (sigu === '경기') {
        DB = DBGg;
        for (let i = 0; i < DB[sido].length; i++) {
            url = urlBase+'&sgguCd=' + DB[sido][i];
            urls.push(url); 
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

let sendUrl_map = function(sigu, sido, j) {
    if(j == 0) return;
    map.relayout();
    const urls = AreaCode(sigu, sido); 
    
    urls.map((url) => {
        axios.get(url)
            .then((res) => {
                const apiList = res.data.response.body.items.item; 
                
                // 병원 리스트가 배열인지 확인 (정상적인 경우에만 처리)
                if (Array.isArray(apiList)) {
                    document.getElementById("map").style.display = "block"; 
                  
                    let allHospitals = []; 
                    allHospitals = allHospitals.concat(apiList);
                   
                    let positions = allHospitals.map(function(hospital) {
                        return {
                            name: hospital.yadmNm,
                            address: hospital.addr
                        };
                    });
                   
                    for (let i = 0; i < positions.length; i++) {
                        const position = positions[i]; // 현재 처리할 병원 데이터 
                        map.relayout();
                      
                        geocoder.addressSearch(position.address, function(result, status) {
                            // 정상적으로 검색이 완료됐으면
                            if (status === kakao.maps.services.Status.OK) {
                                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);      
                               
                                // 마커 생성
                                let marker = new kakao.maps.Marker({
                                    map: map,
                                    position: coords,
                                });
                                markers.push(marker);
                                
                                // 인포윈도우로 장소에 대한 설명을 표시
                                let infowindow = new kakao.maps.InfoWindow({
                                    content: '<div style="width:150px;text-align:center;padding:6px 0;">' + position.name + '</div>'
                                });
                                infowindows.push(infowindow);
                                infowindow.open(map, marker);

                                // 좌표를 추가
                                bounds.extend(coords);
                                map.setBounds(bounds); 
                             }  
                        });
                    }
                }
                else { //데이터가 없을 때

                    document.getElementById("noGps").style.display = "block";  
                    document.getElementById("map").style.display = "none";  
                    document.getElementById("noData").style.display = "block";   
                    sendUrl_map(sigu, sido, 0); 
                }
            })
            .catch((error) => {
                console.error('API 요청 중 오류가 발생했습니다: ', error);
            });
    });
};

// 마커와 인포윈도우를 모두 제거하는 함수
function removeMarker() {
    // 모든 마커 제거
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }   
    markers = [];

    // 모든 인포윈도우 닫기
    for (let i = 0; i < infowindows.length; i++) {
        infowindows[i].close();
    }
    infowindows = [];
    
    // 현재 위치 마커(redmarker)가 있으면 제거
    if (redmarker) {
        redmarker.setMap(null);
        redmarker = null;
    }
}