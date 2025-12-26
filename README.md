https://developer.chrome.com/docs/devtools/performance/reference
https://developer.chrome.com/docs/devtools/rendering/performance
https://developer.chrome.com/docs/devtools/performance/selector-stats -->> 중요 이 내용도 담기

What is partially presented frame?

- https://developer.chrome.com/blog/new-in-devtools-100#perf

- compositor thread는 메인 스레드에서 자바스크립트 실행이나 layout·paint 작업이 지연되거나 막혀 있어도, 이미 생성된 레이어를 기반으로 transform·opacity·스크롤 같은 합성 작업을 독립적으로 수행해 화면을 계속 갱신하는 스레드이며, partially presented frame은 메인 스레드에서 준비돼야 할 새로운 시각적 결과는 제때 생성되지 않았지만 컴포지터 스레드가 처리할 수 있는 레이어 이동이나 스크롤 등 일부 업데이트는 화면에 반영된 프레임을 의미한다.
