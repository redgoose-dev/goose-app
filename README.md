# goose-app

이 프로그램은 [goose-api](https://github.com/redgoose-dev/goose-api)를 이용하여 사용할 수 있습니다.  
이것을 활용하여 만들어진 모습은 다음 데모링크를 통해 확인할 수 있습니다.


## demo url

https://projects.redgoose.me/goose/app/


## Usage

먼저 저장소를 클론합니다.

```shell script
git clone https://github.com/redgoose-dev/goose-app.git
cd goose-app
```

composer 인스톨 합니다.

```shell script
composer install
```

`css,js` 파일들을 빌드를 위한 준비작업과 빌드를 합니다.

```shell script
yarn install
yarn run build
```

다음으로 저장소 경로로 들어가서 셋업 스크립트를 실행합니다.  
주로 수정 가능한 사용자 파일들을 복사합니다.

```shell script
./action.sh setup
```

서버 상황에 맞춰서 설정을 하고, 서버를 띄어 사용합니다.


## customize files

저장소에서 제외된 파일들을 직접 수정해서 사용할 수 있습니다.

- `/.env`: 기초적인 설정파일
- `/user/app-icon.png`: 프로젝트에서 사용되는 아이콘 이미지
- `/user/custom.css`: 프로젝트 스타일시트를 커스타마이즈할때 사용합니다.
- `/user/favicon.ico`: 프로젝트 파비콘
- `/view/head-user.blade.php`: `<head/>`엘리먼트에서 추가로 사용되는 요소들을 넣습니다.
- `/user/img-logo.png`: 상단 로고 이미지
- `/user/manifest.json`: `PWA`로 사용되는 설정파일
- `/user/preference.php`: 프로젝트 전반적으로 사용되는 값들모음
- `/user/route.php`: 주소 라우트 파일
