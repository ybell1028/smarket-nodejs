# SMARKET REST API v1.0.0 :shopping_cart:
스마켓은 현명한 소비를 위한 온라인 구매 어시스턴트 기능을 제공합니다.
* [안드로이드 앱 바로가기](https://github.com/tomato8160/smarket-android)

## Endpoint

### api/auth
* __POST__ /login  
    * 유저 로그인  
JSON body(user_id, password)
* __GET__ /refresh  
    * 토큰 재발급
* __POST__ /checkid  
    * ID 중복 체크  
JSON body(user_id)
* __POST__ api/auth/checknickname  
    * 닉네임 중복 체크  
JSON body(nickname)

### api/bookmark
* __POST__ /  
    * 북마크 등록  
header(x-access-token)  
JSON body(folder_name, item_alarm, item_title, item_link, item_image, item_lprice, item_mallname, item_id, item_type)
* __POST__ api/bookmarks/folder  
    * 북마크 폴더 등록  
header(x-access-token)  
JSON body(folder_name)
* __GET__ /  
    * 자신의 모든 폴더안에 있는 북마크 조회  
header(x-access-token)
* __GET__ ?foldername=폴더이름    
    * ?foldername 해당 폴더에 속한 북마크 전체 조회  
header(x-access-token)
* __GET__ /folder  
    * 자신의 북마크 폴더 리스트 조회  
header(x-access-token)
* __GET__ /lprice  
    * 알람 설정된 북마크 최저가 정보 가져오기  
header(x-access-token)
* __PATCH__ /lprice  
    * 알람 ON/OFF  
header(x-access-token)  
JSON body(id, item_alarm)  
* __PATCH__ ?foldername=폴더이름  
    * 북마크 폴더 이름 변경  
header(x-access-token)  
JSON body(new_name)
* __DELETE__ ?foldername=폴더이름  
    * 북마크 폴더 삭제  
header(x-access-token)
* __DELETE__ /id  
    * 해당 id의 북마크 삭제  
header(x-access-token)

### api/crawling
* __GET__  /ruliweb/pageNum  
    * 루리웹 핫딜 정보 크롤링
* __GET__  /ppomppu?id=ppomppu1&page=num  
    * 뽐뿌 핫딜 정보 크롤링  
id = 뽐뿌게시판(ppomppu), 해외뽐뿌(ppomppu4), 오프라인뽐뿌(ppomppu5), 쇼핑특가(shopping)
* __GET__  /fmkorea/pageNum  
    * 에펨코리아 핫딜 정보 크롤링
* __GET__  /coolenjoy/pageNum  
    * 쿨엔조이 핫딜 정보 크롤링
* __GET__  /malltail/pageNum  
    * 몰테일 핫딜 정보 크롤링

### api/fcm
* __POST__  /send  
    * Push Notification Message 전송  
header(x-access-token)  
* __PATCH__  /receive  
    * Firebase Cloud Message Token 확인, 업데이트  
header(x-access-token)
* __GET__ /select  
    * DB에 저장된 Firebase Cloud Message Token 조회  
header(x-access-token)

### api/item
* __GET__ /detail  
    * 상품 상세정보 조회

### api/naver
* __GET__ /search  
    * 네이버 쇼핑 API 검색


### api/users
* __POST__ /  
  * 유저 회원가입  
JSON body(user_id, password, name, nickname, phonenum)
* __POST__ /passwordconfirm  
    * 비밀번호 확인
    header(x-access-token)  
    JSON body(password)
* __GET__ /  
    * 유저 전체 정보 조회, 다만 관리자 계정만 가능(isAdmin, CheckPermission 통과해야함)   
    header(x-access-token)
* __GET__ /:userid  
    * 해당 id의 유저 정보 조회(CheckPermission 통과해야함)  
    header(x-access-token)
* __PUT__ /:userid  
    * 해당 id의 유저 정보 수정 (CheckPermission 통과해야함)  
    header(x-access-token)
    JSON body(user_id, password, name, nickname, phonenum)
* __DELETE__ /:userid  
    * 해당 유저 탈퇴 (CheckPermission 통과해야함)
 
 
