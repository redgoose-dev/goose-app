# goose-app

이 프로그램은 [goose-api](https://github.com/redgoose-dev/goose-api)를 이용하여 사용할 수 있습니다.  
이것을 활용하여 만들어진 모습은 다음 데모링크를 통해 확인할 수 있습니다.

## demo url

https://demo.redgoose.me


## Install

클론받고 먼저 인스톨합니다.

```bash
$ ./script.sh install
```

`user/env.js` 파일을 수정합니다.  
특히 `api` 객체에서 `url`, `token`값은 꼭 입력해줍니다.  
만약 host와 port를 고쳐야 한다면 `app.url` 부분을 고쳐주세요.

테스트를 위하여 개발서버를 돌려봅니다. 기본값 주소는 `http://localhost:3000` 입니다.

```bash
yarn run dev
```

실서버에 적용시키려면 다름과 같이 빌드를 하고 start 실행해주면 됩니다.

```bash
yarn run build
yarn start
```


## env

빌드하기전에 직접 커스터마이즈를 할 수 있습니다.  
먼저 인스톨을 하고 `/user` 경로에 `env.js`와 `env.scss` 파일을 변경해서 원하는 모습으로 고쳐서 사용할 수 있습니다.

사용에 주의할점은 값을 수정하고 `yarn run build`로 다시 빌드하고 `yarn run start`를 해줘야합니다.

### env.js
기초적으로 필요한 부분들을 설정으로 빼두었습니다.

### env.scss
스타일의 일부분을 수정할 수 있습니다.


## user data

### page

별도로 페이지를 추가하고 싶다면 `/pages/page` 경로에 `{filename}.vue` 이름의 파일로 만들고 `http://{URL}/page/{filename}` 형식으로 접속해서 사용할 수 있습니다.

페이지에서 사용하는 이미지는 `/static`에 넣고, `/image.jpg` 형식으로 이미지를 불러올 수 있습니다.

### favicon

`/static/favicon.ico` 경로로 넣어서 사용할 수 있습니다.

### user assets

`/static` 경로에서 파일들을 추가해서 사용할 수 있습니다. `/static/images` 경로는 고정적으로 사용하는 요소들이므로 건드리지 마세요.