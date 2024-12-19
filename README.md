# 웹소캣 게임 만들기

패킷 구조 설계
- connection : 클라이언트가 서버에 연결
- event : 클라이언트가 서버에 송신
- response : 서버가 클라이언트에 송신
- broadcast : 서버에서 모든 클라이언트에 송신
- disconnect : 클라이언트가 연결 해제

패킷 구조

클라이언트가 서버에 송신할 때 : userId, clentVersion, handlerId, payload
서버가 클라이언트에 송신할 때 : 

<hr>

enemy.json 설명
{ "id":  1, "score": 10, "size":70, "hp":5, "speed":1 }
id : 적 개체 유형 식별번호
score : 적 개체를 잡았을 때 주는 점수
size : 적 개체가 갖는 크기 (width, height에 대입)
hp : 적 개체가 갖는 체력
speed : 적 개체가 갖는 이동속도

item.json 설명
{ "id":  1, "score": 10 },
id : 아이템 유형 식별번호
score : 아이템 획득시 얻는 점수

stages.json 설명
{ "id": 1000, "score": 100, "gameSpeed": 1, "level":1 }
id : 스테이지 식별번호
score : 사용하지 않음
gameSpeed : 
level : 적이 스폰되는 타이머에 영향을 줌

item_unlock.json 설명
{ "id":  101, "stage_id": 1001, "item_id": [1,2,11,12], "enemy_id":[1,2] }
id : 해금 정보 식별번호
stage_id : 스테이지 식별번호
item_id : 해금되는 아이템 목록
enemy_id : 해금되는 적 개체 유형 목록

기획
게임 방식 : 일정시간동안 적과 아이템과 상호작용하여 점수를 쌓는 방식

캐릭터 관련
이동 : 상하좌우
공격 : 총알 발사
대쉬 : 잠깐 빠르게 이동

아이템 관련
아이템 종류 : 점수 아이템, 회복 아이템, 속도 증가 아이템
아이템과 플레이어 충돌 처리 : 아이템에 따른 점수 또는 효과 획득
아이템은 6~12초 간견으로 출현, 5초 안에 아이템 두 개를 먹으면 어뷰징으로 판정

적 관련
레벨에 따라 해금되는 적들 중 랜덤으로 출현
레벨이 증가하면 더 자주 스폰됨

Redis 연동

게임 에셋 저장 및 관리
Redis 데이터베이스에 redisClient.set('gameAssets', gameAssets) 로 에셋 정보를 저장.
gameAssets = redisClient.get('gameAssets')로 가져옴.

최고 점수 저장 및 관리
게임클리어 또는 게임오버 후 클라이언트로부터 최종스코어를 받음.
highScore = redisClient.get('highScore')로 가져옴.
최종스코어가 더 높으면 redisClient.set('highScore', 최종스코어)로 저장장




