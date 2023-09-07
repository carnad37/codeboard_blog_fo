# 코드보드 blog 부분

## 개발 요건

1. 인증은 middleware와 asyncData 에서 한다?
   - 추가적으로 체크해야될 부분이 있어보임
2. 배포를 ssr 방식으로 할건지 고민. (보안적인 측면에서 이득)

## Vue2 와의 차이

1. Vue3 + Nuxt3로 개발중인데 차이가 좀 크다..
2. method가 따로 없기에, vue2처럼 Method에만 등록해도 변수 변화에따라 새로 함수가 로드되지 않기에, computed로 구현해주거나 watch로 감시해주어야한다.
3. mixin대신 composable API를 사용하는데, mixin보다 좀더 명시적으로 사용할수 있으나, vue2 라이브러리나 구 소스의 Mixin 호환이 골치아프다..
4. 안그래도 react에 비하면 이용자가 적은데, Nuxt3는 Vue이용자들중에서도 아직 소수인듯하고 완성도도 아직 부족해보인다(고쳐지지 않은 잔 오류. vue2와 호환문제)


## 블로그 구조 관련

1. [ 메뉴 ] 메뉴 전체보기는 본인이아니면 따로 노출될 필요는 없어보임.
2. [ 메뉴 ] 다른유저의 블로그 메뉴는 좌측의 네비게이터를 통해서 보면 충분해보임
3. [ 메뉴 ] 메뉴목록 페이지 자체가 로그인시에만 접근가능하게 수정
4. [ 메뉴 ] 메뉴관리에서 처음엔 Root > 메뉴 출력. 메뉴 클릭해서 in..in 하는 구조. 등록시 현재 탭 기준으로 메뉴구조도 출력.
5. [ 메뉴, 게시물 ] 네비게이터에서 해당 메뉴 클릭시 게시물 리스트 출력되게
6. [ 게시물 ] 작성법은 jupyter notebook 이랑 비슷한형식으로. 한 탭씩 입력 에디터를 선택해서 입력가능.(작업)

## NUXT3 에서 Vue 컴포넌트 호출하기

1. plugin을 이용해서 불러오기... 근데 잘안됨
<pre>
   
</pre>
2. 모듈로 불러오기. 한번 시도했었다가 잘안됨
<pre>
   
</pre>
3. vite에서 빌드 하기
<pre>
   
</pre>
4. 그냥 쌩으로 가져다쓰기
: @types만 정의해서 말그대로 쌩으로 가져다쓰기... 가장 무식하지만 심플한 방법.

## API 요청 도메인과 현재 사이트 도메인이 다를경우

1. CORS에 허용해주어야한다. API 도메인, 사이트 도메인에서 서로 허용이되어있지않으면 결과를 받아오더라도 브라우저가 해당 값을 차단해버린다.
<pre>
  add_header 'Access-Control-Allow-Origin' "${scheme}://{도메인명}" always;
</pre>

2. credentials설정을 사용가능하게 설정해준다.
* 백엔드
<pre>
   // https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
   // Access-Control-Allow-Credentials 는 credentials가 include설정 가능여부를 허가해주는것.
   // 프론트엔드 작업전에 필수적이다.
   add_header 'Access-Control-Allow-Credentials' 'true';
</pre>
* 프론트엔드
<pre>
   // Nuxt3기준으로는 UseFetchOptions에 credentials값을 설정해준다
   const options : UseFetchOptions<ResT> = {}

   // https://developer.mozilla.org/ko/docs/Web/API/Request/credentials
   // default는 same-origin이다. 현재 도메인과 api도메인이 같은경우만 쿠키값을 전송한다.
   // cross domain을 허용하고싶으면 include로 설정
   // cookie 전송 자체를 막고싶으면 omit으로 설정하면된다.
   options.credentials = 'include'
</pre>

