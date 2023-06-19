# **🎶 The Beat**

The Beat는 **실시간 통신**을 이용한 **배틀형 리듬게임 웹 어플리케이션**입니다.

<p>
  <img width=500 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/ab1459bd-297e-4fc8-9a68-8ac4ef77f45e" />
</p>

[Deployment🏠](https://thebeat.fun)

<br>

# 📖 Table of Contents

- [💪 Motivation](#💪-motivation)
- [🎥서비스 화면](#🎥-서비스-화면)
- [기능 및 작업 기여도](#기능-및-작업-기여도)
- [🔥 Issue Points](#🔥-issue-points)
  - [Canvas API를 통해 어떻게 리듬게임을 구현할 수 있을까?](#canvas-api를-통해-어떻게-리듬게임을-구현할-수-있을까)
    - [Canvas API를 선택한 이유](#canvas-api를-선택한-이유)
    - [델타 타임의 적용](#델타-타임의-적용)
    - [다음 프레임 호출은 setTimeout과 requestAnimationFrame중 무엇을 써야 할 까?](#다음-프레임-호출은-settimeout과-requestanimationframe중-무엇을-써야-할-까)
    - [Miss처리](#miss-처리)
  - [Web Audio API와 Canvas API의 싱크를 어떻게 맞출 수 있을까?](#web-audio-api와-canvas-api의-싱크를-어떻게-맞출-수-있을까)
    - [Web Audio API를 선택한 이유](#web-audio-api를-선택한-이유)
    - [Web Audio API 기본 원리](#web-audio-api-기본-원리)
    - [Web Audio API와 Canvas API 연결하기](#web-audio-api와-canvas-api-연결하기)
  - [실시간 콤보, 이펙트, 결과창의 구현](#실시간-콤보-이펙트-결과창의-구현)
    - [실시간으로 어떻게 표시해줄 수 있을까?](#실시간으로-어떻게-표시해줄-수-있을까)
    - [useLayoutEffect의 적용](#uselayouteffect의-적용)
  - [Socket.IO를 더 효율적으로 사용해보기](#socketio를-더-효율적으로-사용해보기)
    - [Socket.IO와 WebSocket 중 어떤 것을 사용해야 하지?](#socketio와-websocket-중-어떤-것을-사용해야-하지)
    - [Socket.IO 최적화의 중요성](#socketio-최적화의-중요성)
    - [프로젝트 에서 Socket.IO를 어떻게 최적화를 적용하지?](#프로젝트-에서-socketio를-어떻게-최적화를-적용하지)
- [🗓 Schedule](#-schedule)
- [🔗 Repository Link](#-repository-link)
- [🛠 Tech Stacks](#-tech-stacks)
- [✅ Test](#✅-test)
- [🚀 Deployment](#🚀-deployment)
- [🏠 Members](#-members)

<br>

# **💪 Motivation**

저희 팀의 목표는 재밌는 프로젝트를 만들어 보자! 였습니다.

그 중 싱글스레드 `JavaScript`를 이용해 게임을 만들면 재밌지 않을까? 라는 물음으로부터 시작하였습니다.

그렇게 실시간 통신과 `Canvas API`를 이용 할 수 있는, 시각적으로 재미있는 프로젝트를 고민하여 리듬게임이라는 아이디어를 선택하였습니다.

<br>

# **🎥 서비스 화면**

<p>
  <img width=300 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/e90c0d8f-b57e-4fc3-bcf1-d590b8d694d9" />
  <img width=300 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/c5dc2f1e-7a15-4d8c-b230-530ba3e8eea2" />
</p>

[영상으로 확인하고 싶다면 클릭해 주세요 ✅](https://vimeo.com/836819032?share=copy)

<details>
  <summary>

### 기능 및 작업 기여도

  </summary>

## Frontend

|                        | 정영빈 | 이상혁 | 허수빈 |
| ---------------------- | -----: | -----: | -----: |
| Login 페이지           |   100% |        |        |
| Lobby 페이지           |        |   100% |        |
| BattleRoom 페이지      |    70% |    30% |        |
| BattleResults 페이지   |    70% |    30% |        |
| RoomMaker 페이지       |   100% |        |        |
| Records 페이지         |   100% |        |        |
| AudioVisualizer 페이지 |        |        |   100% |
| Loading 페이지         |   100% |        |        |
| GameController 기능    |   100% |        |        |
| 유닛 테스트            |    30% |    70% |        |
| E2E 테스트             |   100% |        |        |

<br/>

## Backend

<br/>

|                         | 정영빈 | 이상혁 | 허수빈 |
| ----------------------- | -----: | -----: | -----: |
| 실시간 배틀 룸 기능     |   100% |        |        |
| Login 기능              |   100% |        |        |
| 방 생성 기능            |    80% |        |    20% |
| Token 인증              |   100% |        |        |
| 오디오 프록시 서버 기능 |        |        |   100% |
| 음악 데이터 연동        |        |   100% |        |
| 스키마 디자인           |    50% |    50% |        |
| 실시간 로비 방 렌더링   |        |   100% |        |
| 실시간 로비 유저 렌더링 |        |   100% |        |
| 유닛 테스트             |        |        |   100% |

</details>
<br/>

# 🔥 Issue Points

3주간의 프로젝트를 진행하며 겪은 여러 이슈들 중 핵심적인 이슈들을 설명하겠습니다.

<br>

## **Canvas API를 통해 어떻게 리듬게임을 구현할 수 있을까?**

리듬게임을 진행하는 배틀룸에서 부드러운 애니메이션과 정확한 타이밍을 유지하지 위해 노트가 일정한 속도로 떨어지도록 만드는 것은 저희 과제 중 하나였습니다. 그리고 사용자가 노트를 칠 타이밍을 놓쳤을 때 `Miss`에 대한 로직도 또 하나의 과제였습니다.

<br>

### **Canvas API를 선택한 이유**

<hr>

<p>
  <img width=300 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/7762cda0-648d-4de0-b0b5-dc1891387a67" />
</p>

<p>
  <img width=500 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/26c7686e-fe07-44f1-82fe-41407e375308" />
</p>

이렇게 JS와의 호환성이 좋고 HTML5 표준의 일부로써 모든 최신 웹 브라우저에서 지원되기 때문에 사용에 용이하겠다 생각하였습니다.

성능면에서도 하드웨어 가속을 지원하기 때문에 부드럽고 반응이 빠른 그래픽 렌더링을 제공해 유저에게 좋은 게임 경험을 부여할 수 있을 것이라 판단하여 선택하게 되었습니다.

<br>

### **델타 타임의 적용**

<hr>

**어떻게 노트를 일정한 속도로 떨어지게 할 것인가?**

저희는 노트를 그리는 로직을 적용시키며 노트의 속도가 일정하게 이동하지 않는 부분을 캐치해냈습니다. 그 이유에 대해 조사를 해보니 각 **프레임 사이의 시간 차가 일정하지 않게 생성**되기 때문이란 것을 알 수 있었습니다.

<p>
  <img width=300 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/ce3c79f4-abf5-4162-a0c1-9505b274f971" />
</p>

보통의 모니터 주사율은 60fps이기 때문에 1초간 60개의 프레임으로 화면을 구성합니다.

1프레임과 1프레임의 차이가 길어지거나 짧아질 경우 우리는 기시감을 느껴 낯설게 받아들이게 되는 것이었습니다.

그렇다면 **프레임의 시간 차이에 상관 없이 일정하게 애니메이션을 그리는 방법은 무엇일까?** 하고 생각해보게 되었습니다.

<p>
  <img width=300 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/298731a0-dc75-44c2-bfa4-7dba9426c82d" />
</p>

그렇게 조사하던 중 그래픽 프로그래밍에서 마지막으로 업데이트된 후 경과된 시간(즉, 이전"프레임")에 따라 시나리오를 가변적으로 업데이트하는 데 사용되는 **델타 타임**이라는 용어를 찾아 볼 수 있었습니다.

1. 이는 현재와 마지막 호출 사이의 시간을 밀리초 단위로 저장하는 타이머를 초당 프레임마다 호출하여 수행됩니다.
2. 그 결과 캐릭터가 이동하는 데 걸린 실제 시간은 업데이트 속도와 처리 능력, 인터넷과 관계 없이 일정하게 표현할 수 있습니다.

<p>
  <img width=300 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/22c9a585-7481-4018-8fb3-8ef9e36e4ef3" />
</p>

그렇다면 **일정한 속도마다 프레임 간의 델타 타임을 곱해주면 되지 않을까?** 라는 생각을 하게 되었습니다.

<p>
  <img width="350" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/9aead74e-a9ae-4358-a239-33dcc19a65d5">
  <img width="277" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/f54f14b0-c693-48bc-b82a-a2d3993bce23">
</p>

다음은 예시 코드입니다.

<img width="700" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/d7d3d1e9-ce9d-41cd-8d86-58e99fecfb8c">

<br>

### **다음 프레임 호출은 `setTimeout`과 `requestAnimationFrame`중 무엇을 써야 할 까?**

<hr>

대부분의 스크린의 업데이트 빈도는 1초에 60번 정도(60fps)와 같습니다.

이 말은 페이지 스타일을 1초당 천 번 바꿔도 60번 밖에 적용되지 않는다는 것을 알 수 있었습니다.

저희는 렌더링을 다시 시키기 위해 setTimeout 중 골라야 했는데 setTimeout의 경우 Drift가 생기거나 디스플레이가 가능한 속도보다 더 빠르게 호출이 되어 낭비되는 콜백 호출이 있을 수 있음을 알았습니다.

`requestAnimationFrame(callback)`은 브라우저가 다음 화면 **리프레시 직전에 콜백 함수를 실행하도록 예약**합니다. 그리고 이를 통해 브라우저의 리프레시 레이트와 동기화되어 최적의 애니메이션 및 게임 루프를 제공합니다.

따라서 예측 가능한 렌더링을 위해 `requestAnimationFrame()`를 사용하기로 했습니다.

<img width="700" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/bcbfb9b2-3126-4146-8a48-c71195b9853c">
<img width="700" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/fd3241be-c1d7-4925-9ca8-655ba86051e9">
<img width="700" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/5ac1b76a-9f91-4d83-840a-4a9ee9b61f91">

<br>

### **`Miss` 처리**

<hr>

보통의 리듬게임의 경우 `Miss`처리를 해주는 로직이 있기에, 저희 프로젝트도 설정해 줄 필요가 있었습니다.

<img width="250" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/71bc39ad-24d3-49ba-ad0f-ed217df5f8a2">

`Miss` 처리는 현재 음악이 시작한 시간과 노트가 렌더링을 시작한 시간을 계산해 난이도에 따라 미스 범위를 주었습니다.

<img width="750" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/0c4bf619-7b20-4eb5-bde5-b9445311b92a">

<br>
<br>

## **`Web Audio API`와 `Canvas API`의 싱크를 어떻게 맞출 수 있을까?**

저희는 캔버스가 오디오에 반응하게 만들어, 리듬게임의 경험을 향상시키고자 하였습니다.

오디오와 Canvas API를 어떻게 연결할지 부터가 고민이었습니다.

<br>

### **`Web Audio API`를 선택한 이유**

<hr>

저희는 프로젝트에서 의존성을 줄이고자 `3rd Party` 라이브러리를 사용하기 보다는 내장 API인 `Web Audio API`를 사용하였습니다.

<img width="300" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/b8474332-bbbd-414b-ba4d-5d5a5b267882">

`Web Audio API`는 다른 `3rd Party` 라이브러리들의 내부에서도 사용되는 점을 알 수 있었고,

`Canvas API`를 이용해 반응형으로 렌더링 시키는 강력한 기능이 있어, 이를 프로젝트에 적용시켜보고자 하였습니다.

<br>

### `Web Audio API` 기본 원리

<hr>

`Web Audio API`를 통해 오디오를 다루는 원리는 다음과 같습니다.

1. 먼저 Audio Input을 입력받습니다.
2. `AudioContext` 인터페이스를 통해 오디오 관련 작업을 진행합니다.
3. Destination으로 출력합니다.

<img width="350" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/c2cfa1fd-27a5-4fc7-a0ba-1cf432fe014e">

우선 S3에서 받은 오디오 데이터를 Buffer 데이터로 변환 시키는 것부터 해주어야 했습니다.

<img width="596" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/021c3f59-a773-4b92-93c7-cee4b260ce11">

여기서 Buffer가 무엇인지 알 필요가 있습니다.

`Buffer`란? RAM에 작은 영역인 `Buffer`란 이름의 버스 정류장을 만들어 일련의 데이터 스트림이 모이면 (출발 시간이 되면) 처리되기 위해 내보내어 집니다.

이 `Buffer`에 Audio Data를 **8비트의 정수 배열로 변환 시켜 담아** 이걸 `AudioContext`의 시작 지점인 `SoucrNode`와 연결 시킵니다.

다음은 `AudioBuffer` 예시입니다.

<p>
  <img width="750" alt="image" src="https://user-images.githubusercontent.com/115068443/228592960-d7eba3c8-d267-4e9a-9a5c-f57c5f71c5ed.png">
</p>

<img width="350" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/1c2254de-72f5-4e88-bfc8-ccfda806d192">

<br>

이렇게 연결된 `SourceNode`와 일련의 작업 노드들의 가공을 통해 `Destination`(output)으로 출력이 됩니다.

<br>

<img width="200" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/45ac2cf1-7a88-4d7f-94c6-e9ad197ffd71">

<br>

### **`Web Audio API`와 `Canvas API` 연결하기**

<hr>

이렇게 `SourceNode`에 입력된 `Buffer`를 이용해 **주파수와 진폭정보에 기반한 시각화**를 해줄 필요가 있었습니다.

`Web Audio API`의 작업노드 중에는 `AnalyserNode`라는 메소드가 있었습니다.

<img width="500" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/651fb884-a877-483a-9041-19f76075ad3d">

간단하게 말하면 FFT라는 연산을 통해 주파수로 변환시켜주는 메소드입니다.

<p>
  <img width="800" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/bf8fc248-f6f3-4314-91ac-7278ceee1d75">
</p>

이렇게 변환한 `dataArray`와 `Canvas API`를 통해 data를 그려 줍니다.

<p>
  <img width="550" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/6c7f366f-a057-4b6f-b652-90e66152571a">
</p>
<p>
  <img width="500" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/9fe0248f-1514-490e-93a4-d9ad18dd54d3">
</p>

<img width="600" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/533cd0b1-8f25-47ea-9494-f4d018b03a75">

<br>
<br>

## **실시간 콤보, 이펙트, 결과창의 구현**

<br>

이제 실시간으로 노트가 히트될 때 마다 변화하는 스코어, 콤보, 이펙트 그리고 결과창을 구현하기 위해 실시간으로 통신이 이루어져야 했습니다.
이를 위해서는 Redux를 통해 상대가 입력하는 정보와 내가 입력하는 정보를 나눌 필요가 있었습니다.

<p>
  <img width="400" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/05510b05-2d41-44b6-aca7-6c33d56f3d1a">
  <img width="400" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/087ff138-8ce4-477f-8cdd-bbd3d9839a7b">
</p>

### **실시간으로 어떻게 표시해줄 수 있을까?**

<hr>

그 다음 Task는 나 자신의 점수와 스코어, 콤보를 관리하고 실시간으로 상대방에게 넘겨주는 것을 해결해야 했습니다.

나 자신의 정보를 관리하기 위해서는 하나의 Resource에서 전부 관리해주는 것이 옳다고 판단하였고, 전역 상태 관리 툴인 `Redux`를 선택하게 되었습니다.

1. 내 정보는 `useState`를 통해 관리

<p>
  <img width="250" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/dffd50de-0da9-495a-9a66-e329e4599446">
</p>

2. 상대방한테 내 정보를 표시하는 것은 `Redux`를 통해 관리한 내 정보를 `Socket`을 통해 전송하면 `Socket`에서는 `BattleUser`의 정보로 전달 받음.

<p>
  <img width="400" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/b8da00b0-e326-4606-b59b-30c0173a36ad">
</p>
<p>
  <img width="600" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/198354eb-9b35-45a3-9f0b-438fb7e48c45">
</p>

3. `GameController`에서는 `BattleUser`의 정보가 `props`로 있을 경우 `BattleUser`의 정보를 표시, **아닐 경우 현재 `currentCombo`를** 표시!

<p>
  <img width="450" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/8e347417-82f1-4900-9550-68dd7ed6b1b0">
</p>
<p>
  <img width="300" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/fd303846-c5db-442c-98e4-504b44cc594d">
</p>
<p>
  <img width="500" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/a541ed42-1667-4140-8e23-192eab1b5aff">
</p>

### **useLayoutEffect의 적용**

<hr>

이제는 노래가 끝날 때 결과창을 표시해주면 됐습니다. 그러나 **결과 값이 원하는 대로 표시되지 않는 이슈**가 있었습니다.

처음 해결 방법은 입력된 정보들을 결과창으로 그대로 보내주면 되지 않을까? 라고 단순히 생각하여,

**단순히 노래의 길이와 현재 시작한 시간이 같아질 때** 저장한 정보를 `dispatch`하면 되겠다 라는 생각을 했으나,

1. `console.log(콤보)`를 확인해 보니 두번 렌더링이 되며 값이 제대로 들어오지 않는 것을 알 수 있었습니다.

<p>
  <img width="435" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/334bab14-0c08-467a-8aaf-e45f5e9bdbf1">
</p>

그 이유에 대해 조사를 해보며 이유를 알 수 있었습니다.

1. `useEffect`와 `requestAnimationFrame`을 같이 이용.
2. `requestAnimationFrame`은 `Repaint` 이전 주어진 콜백을 실행한 후 `Layout`과 `Paint`를 진행 합니다.
3. `useEffect`의 `cleanup`이 브라우저의 `Paint` 이후에 실행되며 requestAnimationFrame을 한 번 더 호출해 값이 초기화되는 것이었습니다.

<p>
  <img width="300" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/4117410a-239c-410c-82e6-3ff66efaa262">
</p>

위 이미지처럼 한 프레임 안에서 콜백을 먼저 호출한 뒤 `Painting`을 진행합니다.

반면, `useEffect`는 실제로 `DOM`이 업데이트된 후 동기적으로 실행되는 것이 아니라, **나중에 실행**된다는 것이 문제였습니다.

<br>

<p>
  <img width="400" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/3d8723d8-a33c-4e1a-bdaa-860a89b06171">
</p>

<br>

그래서 `useEffect`가 실행되기 전에, `requestAnimationFrame`이 스케쥴을 선점해 `Repaint` 할 수 있다는 것이 문제였습니다.

<p>
  <img width="400" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/0dc3b5fd-63a1-4f3d-8218-ba7201cf3d36">
</p>

- 이 말은 `useEffect`의 `cleanup`이 나중에 실행되기 때문에, `rAF`가 한번 더 호출되고 `cleanup`이 실행되어 값이 원하는 값으로 들어오지 않았습니다.
- 이를 해결하기 위해 `useEffect` 외에도 `DOM`이 업데이트 된 후 동기적으로 실행된다는 점을 제외하면 동일한 방식인 `useLayoutEffect`를 도입해 해결해보고자 하였습니다.

<p>
  <img width="400" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/368363d5-6aaf-4425-af29-8846f4a4d323">
</p>

두 `Hook` 다 `React`가 `DOM`과 `Refs`를 최신화 시킨 뒤 실행이 되지만 차이가 있었습니다.

- `useLayoutEffect`는 `React`가 `DOM`을 최신화 시킨 뒤 곧 바로 `Paint` 이전에 실행하고 정리합니다.
- `useEffect`는 `React`가 `Paint`를 한 직 후 `Effect`를 실행하고 정리합니다.

이를 적용해 `requestAnimationFrame`의 호출이 이루어지기 전에 `dispatch`를 통해 값을 받음으로써 원하는 결과값을 얻어 이슈를 해결하였습니다.

<br>
<br>

## **Socket.IO를 더 효율적으로 사용해보기**

노트에 대한 많은 정보가 전달될 때 상대의 키값 또한 전달되므로 순간적으로 Latency의 증가가 발견되어 Socket.IO를 통한 실시간 배틀에서의 최적화를 고민하게 되었습니다.

The Beat 리듬게임 프로젝트에서는 Socket.IO을 사용하여 서버와 여러 클라이언트 간의 실시간 통신을 합니다. 따라서 저희는 Socket.IO 통신의 효율성과 성능이 중요하다고 판단했습니다.
그리고 다음과 같은 다양한 방안을 고안하여 Socket.IO 최적화를 하고자 노력하였습니다.

<br>

### Socket.IO 프레임워크를 사용한 이유

<img width="500" src="https://github.com/Team-Orm/the-beat-client/assets/107290583/8623cbf0-64ca-4211-ac66-42e4ff4d9592">

저희는 WebSocket을 단독으로 사용할지 아니면 Socket.IO 프레임워크를 사용할지 고민해봤습니다.

**Socket.IO를 선택한 이유**
<br>
Socket.IO는 양방향 통신을 하기위해 WebSocket 기술을 활용하는 라이브러리입니다.
<br>
WebSocket만 사용해도 실시간 양방향 통신을 제공하지만, 아래와 같은 Socket.IO가 제공하는 몇몇 기능들은 기본적으로 제공하지 않습니다.

- **실시간 이벤트 기반 통신**: 음악 게임에서는 사용자의 입력에 따라 실시간으로 게임이 반응해야 합니다. Socket.IO는 이벤트 기반의 통신을 지원하므로, 사용자의 각각의 액션을 이벤트로 취급하고 서버에 실시간으로 전달하는 것이 가능합니다.

- **자동 재연결 지원**: 게임 중 네트워크 상태가 불안정할 경우, 플레이어의 경험을 저해할 수 있습니다. Socket.IO는 연결이 끊어졌을 때 자동으로 재연결을 시도하므로, 사용자의 게임 경험이 중단되는 것을 최소화할 수 있습니다.

- **네임스페이스와 룸 기능**: Socket.IO는 네임스페이스와 룸을 지원하여 다수의 사용자가 동시에 게임을 즐길 수 있도록 만듭니다. 또한, 룸을 사용하면 여러 플레이어가 동일한 게임 세션에 참여할 수 있으며, 서버는 특정 룸의 모든 클라이언트에게 쉽게 메시지를 전송할 수 있습니다

- **환경 호환성 보장**: 모든 웹 브라우저나 네트워크 환경이 WebSocket을 지원하지 않는 경우, Socket.IO의 HTTP Long-Polling fallback기능은 어떠한 환경에서도 실시간 통신을 가능하게 합니다. 따라서, 저희 프로젝트는 어떠한 웹 브라우저에서도 실시간 통신이 가능합니다.

<br>
위와 같은 특징이 저희 프로젝트에 필요하여 Socket.IO를 선택하였습니다.

<br>

### Socket.IO 최적화의 중요성

소켓 최적화는 컴퓨터 네트워크에서 소켓 통신의 성능과 효율성을 향상시키는 프로세스를 말하며, 소켓 최적화는 응용 프로그램과 장치 간의 데이터 전송 속도와 안정성을 크게 향상시킬 수 있기 때문에 중요합니다.
<br>

저희 The beat 리듬게임에서 Socket.IO를 최적화하는 것은 플레이어에게 원활하고 즐거운 게임 경험을 제공하는 데 중요합니다.
리듬 게임은 오디오, 비주얼, 플레이어의 입력 간의 정확한 타이밍과 동기화가 중요하며, 지연 시간, 지연 또는 통신 불일치는 게임플레이 경험에 부정적인 영향을 미칠 수 있습니다.
The beat 리듬게임에서 Socket.IO의 최적화가 필요한 이유는 아래와 같습니다.

- **짧은 지연 시간**: The beat에서는 플레이어가 음악에 맞게 내려오는 노트가 떨어지는 타이밍에 맞게 키를 쳐야합니다. 서버와 클라이언트 간의 통신이 조금만 지연되어도 플레이어가 노트를 칠 타이밍를 놓쳐 점수와 전반적인 경험에 영향을 미칠 수 있습니다.

- **동기화**: 멀티플레이어 리듬 게임에서는 플레이어 간 동기화를 유지하는 것이 매우 중요합니다. 게임 상태가 모든 플레이어에게 실시간으로 업데이트되지 않으면 점수가 불일치하거나, 노트를 놓치거나, 플레이어에게 혼란을 줄 수 있습니다.

- **확장성**: 소켓을 최적화하면 게임 서버의 성능을 개선하여 더 많은 동시 연결을 처리할 수 있습니다. 두명 이상의 플레이어가 동시에 접속할 수 있는 멀티플레이어 리듬 게임에 중요합니다.

- **리소스 관리**: 최적화된 Socket.IO 구현은 게임의 전반적인 리소스 사용량을 줄여 서버와 클라이언트 측 모두의 성능을 개선하는 데 도움이 됩니다. 원활한 게임플레이: 잘 최적화된 Socket.IO 구현은 일관된 프레임 속도를 유지하고 게임 플레이 중 끊김이나 멈춤을 방지하여 플레이어가 원활하고 즐거운 경험을 할 수 있도록 해줄 수 있습니다.

<br>

### 프로젝트에서 Socket.IO를 어떻게 최적화를 적용하지?

The Beat 프로젝트에서는 Socket.IO의 'Namespace'와 'Room' 기능을 활용하여 서버 구조를 최적화하였습니다.
<br>

Socket.IO의 'Namespace'는 특정 주제 또는 주제 그룹에 대한 소켓 통신을 분리하고 관리할 수 있는 방법을 제공합니다. 이를 통해 각 게임 세션을 서로 독립된 'Namespace'로 구분하였으며, 이로 인해 각 세션 내의 통신이 서로 격리되어 이루어질 수 있게 하였습니다.

<img width="500" src="https://github.com/Team-Orm/the-beat-client/assets/107290583/b2ac1b26-ba19-43b7-933f-ddfcf3a0a030">

<br>

더 나아가, 'Room' 기능을 사용하여 각 'Namespace' 내에서 더 세밀한 그룹화를 수행하였습니다. 각 게임 세션 내에서의 참가자 그룹을 'Room'으로 분리함으로써, 상대가누른 키 메세지를 훨씬 효율적이고 정확하게 관리할 수 있게 되었습니다.

<img width="500" src="https://github.com/Team-Orm/the-beat-client/assets/107290583/0d44bdbb-0055-4a7f-8a8d-bd81116e0b28">

<br>

**Socket.IO 최적화 적용**
<br>

<img width="500" src="https://github.com/Team-Orm/the-beat-client/assets/107290583/51bb40aa-0d22-4450-9040-eb56f6a7cc58">
<br>

이미지처럼 저희 프로젝트에서는 Lobby와 Battle room으로 Namespace를 나누고 Battle room의 각가의 방에 Room기능을 사용하여 Socket.IO를 구조화 해주어 최적화를 진행하였습니다.
Socket.IO를 구조화 해주어 얻은 결과로는 아래와 같습니다.

- **효율적인 메시지 전송**: 최적화된 소켓 구조를 사용하면, 필요한 클라이언트에게만 메시지를 전송할 수 있어 트래픽이 줄어들고 통신이 효율적으로 이루어집니다.
- **성능 향상**: 불필요한 메시지 전송이 줄어들어 클라이언트의 메시지 처리 부하가 감소하고, 전체적인 성능이 향상됩니다.
- **유지 보수성**: 소켓 구조를 최적화하면 아래의 프로젝트에 사용한 코드처럼 구조가 명확해져서 유지 보수와 확장이 쉬워집니다.

<br>
  <img width="400" src="https://github.com/Team-Orm/the-beat-client/assets/107290583/059fc0fe-1eec-446f-b1f6-74a867161784">

<br>
<img width="650" src="https://github.com/Team-Orm/the-beat-client/assets/107290583/88d75dce-87f2-4786-a8cc-2446dc3cea76">

<br>
<br>

# 🗓 Schedule

### 프로젝트 기간 : 2023.03.6 ~ 2023.03.29 / 기획 10일 개발 14일

- 1 주차 : 기획 및 설계
  - 아이디어 수집
  - 기술 스택 선정
  - Git 작업 플로우 결정
  - 코드 컨벤션, 커밋 룰 등 팀 협업 규칙 정립
  - Figma를 사용한 Mockup 제작
  - MongoDb를 이용한 DB Schema 설계
  - Notion을 이용한 칸반 작성
- 2주차 : 기능 개발
  - 백엔드 서버 구현
  - 리듬게임 기능 구현
- 3주차 : 테스트케이스, 리팩토링 및 발표

  - 테스트 코드
  - 리팩토링 및 버그 수정
  - 리드미 작성
  - 팀 프로젝트 발표 준비 및 발표
  - 배포

  <br>
  <br>

# 🔗 Repository Link

- [The Beat Client](https://github.com/Team-Orm/the-beat-client)
- [The Beat Server](https://github.com/Team-Orm/the-beat-server)

<br>
<br>

# 🛠 Tech Stacks

### Frontend

- React
- Redux
- React Router
- Styled Components
- Web Audio API
- Canvas API
- Socket.io
- ESLint
- Firebase
- Netlify

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io
- ESLint
- AWS S3
- AWS Elastic Beanstalk

<br>
<br>

# ✅ Test

- Frontend: React Testing Library, Jest
- Backend: Jest, Supertest
- E2E: Puppeteer

<br>
<br>

# 🚀 Deployment

- Server: [AWS Elastic Beanstalk](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/Welcome.html)
- Client: [Netlify](https://www.netlify.com/)

<br>
<br>

# 🏠 Members

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/oyobbeb">
        <img src="https://avatars.githubusercontent.com/u/113571767?v=4" alt="정영빈 프로필" width="200px" height="200px" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/HyukE">
	      <img src="https://avatars.githubusercontent.com/u/107290583?v=4" alt="이상혁 프로필" width="200px" height="200px" />
    </td>
    <td align="center">
      <a href="https://github.com/shuh319">
	      <img src="https://avatars.githubusercontent.com/u/115068443?v=4" alt="허수빈 프로필" width="200px" height="200px" />
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li><a href="https://avatars.githubusercontent.com/u/113571767?v=4">Yeongbin Jeong 정영빈</a></li>
        <li>oyobbeb@gmail.com</li>
      </ul>
    </td>
    <td>
      <ul>
        <li><a href="https://avatars.githubusercontent.com/u/107290583?v=4">Sanghyuk Lee 이상혁</a></li>
        <li>mign2ki2@gmail.com</li>
      </ul>
    </td>
    <td>
      <ul>
        <li><a href="https://avatars.githubusercontent.com/u/115068443?v=4">Subin Heo</a></li>
        <li>shuh319@gmail.com</li>
      </ul>
    </td>
  </tr>
</table>
