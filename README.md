# 아이가 아파요 🏣
<br />  

## 1. 소개
> 소아야간진료(20시 이후)가 가능한 병의원 목록과 지도를 볼 수 있도록 할 수 있는 사이트입니다. \
OPEN API 는 공공데이터포털과 카카오맵을 이용하였습니다.

<br /> <br />
![Image](https://github.com/user-attachments/assets/b0960e2a-9eec-4163-bde1-26d8b8f3d4d6)
<br /> <br />
![Image](https://github.com/user-attachments/assets/655a7426-2b1b-424c-b7d3-e19e4512e6a8)

### 작업기간
2025/04, 1주
<br />

### 인력구성
1인
<br />

## 2. 기술스택

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">  <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"><br /><br /> 

## 3. 기능
### 📂 Project Structure (폴더 구조)
```
My baby is sick/
|
|ㅡ index.html         # 메인 페이지
|ㅡ html/      
|  |ㅡ list.html       # 목록 페이지
|  |ㅡ oneMap.html     # 지도 페이지
|ㅡ JS/      
|ㅡ|ㅡ AreaDB.js       # 지역코드
|ㅡ|ㅡ find.js         # 검색코드
|ㅡ|ㅡ gps.js          # 메인(지도)코드
|ㅡ|ㅡ list.js         # 목록코드
|ㅡ css/      
|ㅡ|ㅡ gps.css         # 메인 스타일
|ㅡ|ㅡ list.css        # 목록 페이지 스타일
|ㅡ images /           # 이미지 리소스
|ㅡ README.md          # GitHub 설명 파일
```
<br /><br /><br />

- **지역별 지도 페이지**

![Image](https://github.com/user-attachments/assets/b0960e2a-9eec-4163-bde1-26d8b8f3d4d6)

<br /><br />
--- 
- **목록 페이지**

![Image](https://github.com/user-attachments/assets/655a7426-2b1b-424c-b7d3-e19e4512e6a8)
---
<br /><br />

-  **해당 병원지도**

![Image](https://github.com/user-attachments/assets/aea2fd1e-6278-48a8-b2e3-9a93c3d0fa94)
---
<br /><br />


## 4. 느낀점
- 각 API 마다 제공되는 guide (request, response)를 제대로 확인해야 한다고 느꼈음
- API에서 제공하는 기능을 사용할 수 있는데 내가 생각하는 기능과 달라 활용하는 방법이 까다로움
<br /><br /> <br /> 

## 5. 아쉬웠던 부분
- 지도 이동 시에 병원이 나타나지 않음
- 카카오맵에서 주소로 장소를 검색하는데 정확하게 처리하지 못했음
<br /><br /> <br /> 

## 6. 앞으로 학습할 것들, 나아갈 방향
- 지도 이동 시에 병원 표시
- 주소로 장소 검색 처리 (v)
- 대학병원은 API 포함되지 않아있어 다른 API 결합이 필요 
<br /><br /> <br /> 

### 🏣 Live Demo (배포된 웹 사이트)
[아이가 아파요 웹사이트 보기] ()
