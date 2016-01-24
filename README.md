# Goose APP - First Gallery

Goose를 이용하여 갤러리 앱을 만들게 되었습니다.

이 앱은 웹 환경에서 모바일, 태블릿, 데스크탑에서 사진이나 작품들을 볼 수 있는 용도로 만들기 위하여 만든 갤러리 형태의 앱입니다.  
제목을 First Gallery로 만든 이유는 첫번째로 배포하는 갤러리 방식의 앱이라서 첫번째 갤러리라고 정했습니다.

심플한 형태지만 유연하고 자연스러게 흘러가는 형태로 가다보니 작업량이 상당히 많아지게 되었습니다.  
설정값이 많아졌기 때문에 많이 복잡해 보이지만 충분히 높은 퀄리티의 결과물을 보여줄 수 있을겁니다.



## 1. Install

이 앱은 Goose가 설치되어있는 계정에 설치하는것을 권장합니다.  
다음 경로는 예시로 설치할 계정의 경로입니다.
```
/goose : goose
/app : first gallery app
```

### git를 통한 install

커멘드 명령어를 실행하여 app을 인스톨 할 수 있습니다.

```
mkdir app
cd app
git clone https://github.com/goose-dev/app-first-gallery.git
```

### 파일을 통한 install

1. 저장소의 `Download ZIP`버튼을 눌러 저장소 파일을 다운로드 받습니다.
1. 저장소 파일을 압축 풉니다.
1. ftp서버에 접속하여 `app`이라는 이름의 폴더를 만듭니다.
1. 압축푼 저장소 파일들을 `app` 폴더에 업로드 합니다.



## 2. Make data

갤러리에 출력할 사진을 올리기 위하여 둥지를 만들고 사진을 몇장 올려둡니다. 분류를 이용하여 더욱 효과적일 겁니다.

1. 우선 둥지모듈 `http://{GOOSE}/nest/index/`에 들어가서 `APP목록` 버튼을 눌러 APP을 만들고 srl번호를 기억해둡니다.  
APP 수정이나 삭제버튼을 누르면 이동되는 url주소에서 끝에 숫자가 app 모듈의 srl 고유번호이므로 기억해둡니다. `http://{GOOSE}/goose/app/modify/{srl}/`
1. 둥지 모듈에서 둥지를 만듭니다.  
둥지 만들기 페이지에서 다음과 같은 설정을 주의해주면 됩니다.  
`Nest Skin` 항목은 `advanced`로 변경합니다.  
`Article Skin` 항목은 `markdown`과 같은 썸네일 이미지를 만들 수 있는 스킨을 고릅니다.  
`App`항목은 이전단계에서 만들었던 App을 선택해줍니다.  
`썸네일사이즈`항목은 적절한 크기의 사이즈로 수정해줍니다. (300*300)  
`썸네일 축소방식`항목은 `리사이즈(가로기준)` 값으로 체크하는것을 권장합니다.
1. 둥지를 만들었으면 목록에서 만든 둥지에 들어가 사진들을 몇장 올려봅니다. 이미지를 올리고 썸네일 이미지는 꼭 만듭니다.


## 3. Setting

설치를 한다고 바로 사용할 수 있는것이 아닙니다. App이 돌아갈 수 있도록 Goose에 있는 설정과 맞춰줘야할 필요가 있습니다.

### make index.user.php

먼저 app과 goose의 경로를 설정하도록 App의 루트경로에 `index.user.php` 파일을 만들어서 다음과 같은 내용을 만들어줍니다.

```
<?php
define('__GOOSE__', true);
define('__USE_GOOSE_SESSION__', true);
define('__GOOSE_ROOT__', '/goose'); // goose 경로
define('__GOOSE_LIB__', '../goose/core/lib.php'); // goose 라이브러리 파일 경로 (상대경로)
define('__PWD__', dirname(__FILE__)); // App 경로 (절대경로)
define('__ROOT__', '/app'); // App 경로
define('__ROOT_URL__', 'http://domain-name.com/app'); // App 경로 (http://... 포함된 전체경로)
define('__COOKIE_ROOT__', '/app'); // 쿠키가 저장되는 경로

define('DEBUG', true);

// set preference srl in json
$srl_json_pref = 5;
```

index.user.php 소스에서 `$srl_json_pref`값은 goose 관리자에서 json모듈의 srl값을 지정해주시면 됩니다.

## 