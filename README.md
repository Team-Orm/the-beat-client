# **🎶 The Beat**

The Beat는 실시간 통신을 이용한 **배틀형 리듬게임 웹 어플리케이션**입니다.

<p>
  <img width=500 src="https://github.com/Team-Orm/the-beat-client/assets/113571767/ab1459bd-297e-4fc8-9a68-8ac4ef77f45e" />
</p>

[Deployment🏠](https://frabjous-brigadeiros-9943ad.netlify.app/)

<br>

# 📖 Table of Contents

- [🎶 The beat](#🎶-the-beat)
- [💪 Motivation](#💪-motivation)
- [🎥시연 화면](#🎥-시연-화면)
- [기능 및 작업 기여도](#기능-및-작업-기여도)
- [🔥 Issue Points](#🔥-issue-points)

* [Canvas API를 통해 어떻게 리듬게임을 구현할 수 있을까?](#canvas-api를-통해-어떻게-리듬게임을-구현할-수-있을까)
  - [Canvas API를 선택한 이유](#canvas-api를-선택한-이유)
  - [델타 타임의 적용](#델타-타임의-적용)
  - [다음 프레임 호출은 `setTimeout`과 `requestAnimationFrame`중 무엇을 써야 할 까?](#다음-프레임-호출은-settimeout과-requestanimationframe중-무엇을-써야-할-까)
  - [`Miss` 처리](#miss-처리)
* [Web Audio API를 이용해 오디오를 어떻게 시각화할까?](#web-audio-api를-이용해-오디오를-어떻게-시각화할까)
  - [1) Web Audio API를 선택한 이유](#1-web-audio-api를-선택한-이유)
  - [2) Web Audio API 기본 원리](#2-web-audio-api-기본-원리)
  - [3) Audio Buffer와 Audio Context](#3-audio-buffer와-audio-context)
* [CORS 문제 해결을 위해 어떻게 프록시 서버를 생성할 수 있을까?](#3-cors-문제-해결을-위해-어떻게-프록시-서버를-생성할-수-있을까)
  - [1) 프록시 서버 생성](#1-프록시-서버-생성)
  - [2) 프록시 서버란?](#2-프록시-서버란)
  - [3) 프록시 서버 생성 방법](#3-프록시-서버-생성-방법)
* [React Hooks 사용하며 예기치 않은 비동기적인 동작을 예측이 가능하게 처리 할 수 있을까?](#4-react-hooks-사용하며-예기치-않은-비동기적인-동작을-예측이-가능하게-처리-할-수-있을까)
  - [1) React Hooks이란?](#1-react-hooks이란)
  - [2) React Hooks의 기본적인 규칙과 염두에 두어야 할 점](#2-react-hooks의-기본적인-규칙과-염두에-두어야-할-점)
  - [3) React Hooks를 사용할 때 예기치 않은 비동기적 동작을 처리하기 위한 방법](#3-react-hooks를-사용할-때-예기치-않은-비동기적-동작을-처리하기-위한-방법)
* [socketio를 어떻게 최적화를 해줄까?](#5-socketio를-통한-실시간-배틀에서-어떻게-최적화를-해줄-수-있을까)
  - [1) Socket.IO를 선택한 이유](#1-socketio를-선택한-이유)
  - [2) Socket.IO로 실시간 기능을 구축하는 경우 염두에 두어야 할 점](#2-socketio로-실시간-기능을-구축하는-경우-염두에-두어야-할-점)
  - [3) socket.IO 최적화의 중요성](#2-socketio-최적화의-중요성)
  - [4) Socket.IO 최적화에 대한 몇 가지 규칙과 모범 사례](#3-socketio-최적화에-대한-몇-가지-규칙과-모범-사례)
  - [5) 구조적인 Socket.IO의 최적화 방법](#4-구조적인-socketio의-최적화-방법)
  - [6) Token Bucket Algorithm](#5-token-bucket-algorithm)

- [🗓 Schedule](#-schedule)
- [🔗 Repository Link](#-repository-link)
- [🛠 Tech Stacks](#-tech-stacks)
- [✅ Test](#✅-test)
- [🚀 Deployment](#🚀-deployment)
- [🏠 Members](#-members)

<br>
<br>

# **💪 Motivation**

싱글 스레드 `JavaScript`를 이용해 게임을 만들어 보고 싶었습니다.

그 중 실시간 통신과 `Canvas API`를 이용 할 수 있는, 시각적으로 재미있는 프로젝트를 고민해보다 리듬게임이라는 아이디어를 생각하고 시작하게 되었습니다.

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
| Login 페이지           |   100% |     0% |     0% |
| Lobby 페이지           |    10% |    90% |        |
| BattleRoom 페이지      |    70% |    20% |    10% |
| BattleResults 페이지   |    80% |    20% |        |
| RoomMaker 페이지       |   100% |        |        |
| Records 페이지         |   100% |        |        |
| AudioVisualizer 페이지 |    30% |        |    70% |
| Loading 페이지         |   100% |        |        |
| GameController 기능    |   100% |        |        |
| 유닛 테스트            |    30% |    70% |        |
| E2E 테스트             |   100% |        |        |

<br/>

## Backend

<br/>

|                              | 정영빈 | 이상혁 | 허수빈 |
| ---------------------------- | -----: | -----: | -----: |
| 실시간 배틀 룸 기능          |   100% |        |     0% |
| Login 기능                   |   100% |        |        |
| 방 생성 기능                 |    80% |        |    20% |
| Token 인증 기능              |   100% |        |        |
| 오디오 프록시 서버 기능      |        |        |   100% |
| 음악 데이터 연동             |        |   100% |        |
| 스키마 디자인                |    50% |    50% |        |
| 실시간 로비 방 렌더링 기능   |        |   100% |        |
| 실시간 로비 유저 렌더링 기능 |        |   100% |        |
| 유닛 테스트                  |        |        |   100% |

</details>
<br/>

# 🔥 Issue Points

3주간의 프로젝트를 진행하며 여러 이슈들 중 핵심적인 이슈 요소들은 다음과 같은 요소가 있었습니다.

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

### **`Web Audio API`!?**

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

Buffer란?
CPU와 보조기억장치 사이에서 사용되는 임시 저장 공간을 뜻합니다.

이 임시 저장 공간에 Audio Data를 **8비트의 정수 배열로 변환 시켜 담아** 이걸 소스 노드와 연결 시킵니다.

다음은 출력된 `AudioBuffer` 데이터입니다.

<p>
  <img width="750" alt="image" src="https://user-images.githubusercontent.com/115068443/228592960-d7eba3c8-d267-4e9a-9a5c-f57c5f71c5ed.png">
</p>

<img width="350" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/1c2254de-72f5-4e88-bfc8-ccfda806d192">

이렇게 연결된 SourceNode와 EffectsNode들의 작업을 통해 Destination으로 출력이 됩니다.

<img width="200" alt="image" src="https://github.com/Team-Orm/the-beat-client/assets/113571767/45ac2cf1-7a88-4d7f-94c6-e9ad197ffd71">

이러한 작업 노드 들을 통해 목적지로 가게 됩니다.

<br>

### **Web Audio API와 Canvas API 연결하기**

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

## **Socket.IO와 Redux의 결합**

이제 실시간으로 점수와 콤보 그리고 상대방의 이펙트들을 실시간으로 전송이 되어야 했습니다.
이를 위해서는 Redux를 통해 상대가 입력하는 정보와 내가 입력하는 정보를 나눌 필요가 있었습니다.

<br>
<br>

## 실시간 배틀을 어떻게 최적화 해줄 수 있을까?

노트에 대한 많은 정보가 전달되는 순간에 상대의 키값또한 많이 전달되므로 순간적으로 화면이 끊기는오류 현상 발생 하여 버퍼 오버플로우, 클라이언트 부하가 발생하는 현상이 발견되어 Socket.IO를 통한 실시간 배틀에서의 최적화를 고민하게 되었습니다.

The Beat 리듬게임 프로젝트에서는 socket.IO을 사용하여 서버와 여러 클라이언트 간의 실시간 통신을 합니다. 따라서 저희는 socket.IO 통신의 효율성과 성능이 중요하다고 판단했습니다.
그리고 다음과 같은 다양한 방안을 고안하여 socket.IO 최적화를 추구하고자 노력하였습니다.

> - Socket.IO 최적화의 중요성
> - Socket.IO 최적화에 대한 몇 가지 규칙과 모범 사례
> - Socket.IO 구조 최적화
> - Token Bucket Algorithm

<br>

### 1) Socket.IO를 선택한 이유

- 브라우저 호환성: Socket.IO는 다양한 브라우저와 호환되며, 브라우저에서 웹 소켓을 지원하지 않는 경우에도 자동으로 폴백 기능을 제공하여 원활한 통신을 보장합니다.
- 간편한 이벤트 기반 API: Socket.IO는 이벤트 기반의 API를 제공하여, 개발자가 쉽게 이해하고 사용할 수 있습니다. 이로 인해 개발 시간이 단축되고, 유지 보수가 용이해집니다.
- 네임스페이스와 룸 지원: Socket.IO는 네임스페이스와 룸 기능을 통해 클라이언트를 그룹화하고, 특정 그룹에만 메시지를 전송할 수 있습니다.
- 확장성: Socket.IO는 클러스터링 및 로드 밸런싱을 지원하여, 서버의 확장성을 높입니다. 이를 통해 서버가 동시에 더 많은 클라이언트와 통신할 수 있으며, 시스템 자원을 더 효율적으로 사용할 수 있습니다.

<br>

### 2) Socket.IO로 실시간 기능을 구축하는 경우 염두에 두어야 할 점

- 메모리 누수 문제: Socket.IO에는 메모리 누수와 관련된 몇 가지 문제가 있는 것으로 알려져 있습니다. 해결책 중 하나는 perMessageDeflate(메시지 압축 및 압축 해제) 옵션을 비활성화하는 것입니다. 웹소켓 메시지를 압축하는 기능은 네트워크 트래픽을 크게 줄이는 데 도움이 될 수 있으므로 바람직합니다. 또 다른 방법은 HTTP long-polling fallback을 비활성화하고 웹소켓만 사용하는 것입니다.이 방법은 모든 사용자에게 문제가 해결되지는 않고 특히 웹소켓이 지원되지 않는 네트워크에서 연결하는 클라이언트가 있는 경우 서비스를 사용할 수 없게 되므로 좋은 해결책은 아닙니다.
- 평균 메시지 전송 보장: data integrity가 사용 사례에 중요하다면 Socket.IO가 적합하지 않을 수 있습니다. Socket.IO는 메세지 순서를 보장하지만, 메세지 도착 보장에 관해서는 보장하지 않습니다. 이는 특히 네트워크 상태가 좋지 않거나 연결이 끊어지는 경우 일부 메세지가 수신자에게 전달되지 않을 가능성이 있다는 것을 의미합니다. 최소 한 번은 메세지를 보장(at-least-once messaging guarantee)하도록 Socket.IO를 구성할 수 있으나 여기에는 추가적인 엔지니어링 오버헤드가 발생합니다. 최소 한 번 전송은 최대 한 번 전송보다 우수하지만, 여러 번 전송되는 메시지가 있을 수 있고 이로 인해 사용자 경험이 저하될 수 있으므로 여전히 이상적이지 않습니다.
- 그 외에 제한된 플랫폼 지원, 제한된 기본 보안 기능, Single point of failure, Single-region design, Sticky load balancing와 같은 점이 있습니다.

<br>

### 3) socket.IO 최적화의 중요성

소켓 최적화는 컴퓨터 네트워크에서 소켓 통신의 성능과 효율성을 향상시키는 프로세스를 말하며, 소켓 최적화는 응용 프로그램과 장치 간의 데이터 전송 속도와 안정성을 크게 향상시킬 수 있기 때문에 중요합니다.
저희 The beat 리듬게임에서 socket.io를 최적화하는 것은 플레이어에게 원활하고 즐거운 게임 경험을 제공하는 데 중요합니다.
리듬 게임은 오디오, 비주얼, 플레이어의 입력 간의 정확한 타이밍과 동기화가 중요하며, 지연 시간, 지연 또는 통신 불일치는 게임플레이 경험에 부정적인 영향을 미칠 수 있습니다.
The beat 리듬게임에서 socket.io의 최적화가 필요한 이유는 아래와 같습니다.

- 짧은 지연 시간: The beat에서는 플레이어가 음악에 맞게 내려오는 노트가 떨어지는 타이밍에 맞게 키를 쳐야합니다. 서버와 클라이언트 간의 통신이 조금만 지연되어도 플레이어가 노트를 칠 타이밍를 놓쳐 점수와 전반적인 경험에 영향을 미칠 수 있습니다.
- 동기화: 멀티플레이어 리듬 게임에서는 플레이어 간 동기화를 유지하는 것이 매우 중요합니다. 게임 상태가 모든 플레이어에게 실시간으로 업데이트되지 않으면 점수가 불일치하거나, 노트를 놓치거나, 플레이어에게 혼란을 줄 수 있습니다.
- 확장성: 소켓을 최적화하면 게임 서버의 성능을 개선하여 더 많은 동시 연결을 처리할 수 있습니다. 두명 이상의 플레이어가 동시에 접속할 수 있는 멀티플레이어 리듬 게임에 중요합니다.
- 리소스 관리: 최적화된 socket.io 구현은 게임의 전반적인 리소스 사용량을 줄여 서버와 클라이언트 측 모두의 성능을 개선하는 데 도움이 됩니다. 원활한 게임플레이: 잘 최적화된 socket.io 구현은 일관된 프레임 속도를 유지하고 게임 플레이 중 끊김이나 멈춤을 방지하여 플레이어가 원활하고 즐거운 경험을 할 수 있도록 해줄 수 있습니다.

<br>

### 4) Socket.IO 최적화에 대한 몇 가지 규칙과 모범 사례

Socket.IO 통신의 성능과 효율성을 개선하기 위해 따를 수 있는 Socket.IO 최적화에 대한 몇 가지 규칙 또는 모범 사례를보고 저희 프로젝트에서 사용할 수 있는 규칙을 적용하였습니다.

- namespace 사용: Socket.IO에서 namespce는 단일 연결에서 서로 다른 통신 채널을 논리적으로 분할하는 방법입니다. namespace를 사용하면 애플리케이션의 실시간 통신 기능을 보다 효율적으로 구성하고 세분화할 수 있습니다. 각 namespace는 독립적으로 작동하므로 애플리케이션의 여러 부분이 서로 간섭하지 않고 통신할 수 있습니다.
  저희 프로젝트에서는 다음과 같이 크게 메인이 되는 로비, 배틀룸, 결과창을 위한 세종류의 namespace를 사용하였습니다.

```javascript
const io = socketIO(server, { ... });

const battles = io.of("/battles/");

const results = io.of("/results/");
```

저희 프로젝트에서는 Socket.IO를 사용하여 두 개의 네임스페이스를 생성하고 있으며 "battles"와 "results". 각각의 네임스페이스는 서로 다른 목적을 가지고 있습니다.

- 기본 io에서는 일반적인 로비에 관련한 이벤트와 채팅 기능, 입장해있는 유저의 정보를 다룹니다.
- battles namespace에서는 진행중인 게임과 배틀룸 관련 이벤트를 다룹니다.
- results는 게임의 결과를 위한 namespace입니다.

이러한 namespace의 사용은 애플리케이션의 실시간 통신의 다양한 측면을 분리하여 관리 및 유지보수가 쉽게 합니다. 각 namespace는 독립적으로 사용되므로 애플리케이션의 여러부분이 서로 간섭하지 않고 통신할 수 있습니다.

추가적으로 Socket.IO를 최적화하는 방법은 다음과 같습니다.battles

- 바이너리 데이터 형식 사용: 개발자는 ArrayBuffer 또는 Blob과 같은 바이너리 데이터 형식을 사용하여 네트워크를 통해 전송해야 하는 데이터 양을 줄일 수 있으므로 Socket.IO 통신 성능을 크게 향상시킬 수 있습니다.
- 압축 활성화: Socket.IO는 내장 압축을 지원하므로 전송해야 하는 데이터의 양을 더욱 줄일 수 있습니다. 개발자는 "compress" 옵션을 true로 설정하여 압축을 활성화할 수 있습니다.
- 프로토콜 오버헤드 최소화: Socket.IO는 메시지 유형 및 패킷 ID와 같은 추가 메타데이터를 포함하는 사용자 정의 프로토콜을 사용합니다. 프로토콜 오버헤드를 최소화하기 위해 개발자는 "바이너리" 모드를 사용하고 "압축" 옵션을 true로 설정할 수 있습니다.

<br>

### 5) 구조적인 Socket.IO의 최적화 방법

- 소켓 시간 제한 구현: 소켓 시간 제한을 구현하여 일정 시작이 지나면 유휴 소켓 연결을 닫을 수 있고 이는 유휴 연결로 인해 서버 리소스가 막히는 것을 방지할 수 있습니다.
- 데이터 전송 최적화: 소켓 연결을 통해 전송하는 데이터를 압축하거나 크기를 줄여 최적화할 수 있습니다. 서버의 부하를 줄이고 성능을 개선하는 데 도움을
- namespace 사용: 저희가 사용한 namespace는 Socket.IO의 namespace를 사용하면 기능이나 목적에 따라 소켓을 그룹화할 수 있으며, 이를 통해 소켓 연결을 더 잘 구성하고 서버의 부하를 줄일 수 있으므로 구조적인 최적화 방법에도 해당합니다.
- 로드 밸런서 사용: 소켓 연결 수가 많은 경우 로드 밸런서를 사용하여 여러 서버에 부하를 분산하는 것이 좋습니다.

<br>

### 6) Token Bucket Algorithm

토큰 버킷 알고리즘의 기본 개념은 특정 기간 동안 송수신할 수 있는 패킷 수를 제한하는 것입니다. 저희는 토큰 버킷 알고리즘을 데이터 송수신 속도를 조절하여 저희 프로젝트에서 소켓 사용을 최적화하는 방법에 대해 찾아보았습니다. 이는 특정 수의 토큰이 포함된 톸큰 버킷을 유지함으로써 이루어지며, 각 토큰은 송수신할 수 있는 데이터의 단위를 나타냅니다. 다음과 같은 방법으로 토큰버킷 알고리즘을 구현할 수 있습니다.

```javascript
const io = require("socket.io")(server);
const tokenBucket = {
  capacity: 100, // 버킷 안의 최대 토큰 수
  tokens: 100, // 버킷 안의 현재 토큰 수
  fillRate: 10, // 1초당 더할 토큰 갯수
  lastUpdateTime: Date.now(), // 가장 최근 업데이트한 시간
};

io.on("connection", (socket) => {
  console.log("A user has connected");

  // 데이터 이벤트 리스너
  socket.on("data", (data) => {
    // 버킷 안에 충분한 토큰이 있는지 확인
    if (tokenBucket.tokens >= data.length) {
      // 버킷에서 토큰을 제거
      tokenBucket.tokens -= data.length;

      // 데이터를 모든 연결된 클라이언트에게 전송
      io.emit("data", data);
    } else {
      // 충분한 토큰이 있지 않다면 요청을 거절
      socket.emit("error", "Not enough tokens");
    }
  });
});

// 고정된 비율로 토큰 버킷을 업데이트
setInterval(() => {
  const now = Date.now();
  const delta = (now - tokenBucket.lastUpdateTime) / 1000;
  const tokensToAdd = delta * tokenBucket.fillRate;
  tokenBucket.tokens = Math.min(
    tokenBucket.capacity,
    tokenBucket.tokens + tokensToAdd,
  );
  tokenBucket.lastUpdateTime = now;
}, 1000);
```

위 예시 코드에서는, 먼저 tokenBucket 객체를 생성하여 최대 토큰 수(capacity), 토큰 채움 비율(fillRate), 버킷 안의 최대 토큰 수(capacity)를 가장 최근 업데이트 시간(lastUpdateTime)을 설정하였습니다. 그 다음 "data" 이벤트를 수신하고 버킷에 데이터를 전송하기에 충분한 토큰이 있는지 확인합니다. 토큰이 충분하면 버킷에서 토큰을 제거하고 연결된 모든 클라이언트에 데이터를 보냅니다. 토큰이 충분하지 않으면 "error" 이벤트를 발생시켜 요청을 거부합니다. 그런 다음 setInterval을 사용하여 토큰 버킷을 고정된 비율로 업데이트하고, 토큰 채움 비율과 가장 최근 업데이트 시간 이후 경과된 시간에 따라 버킷에 토큰을 추가합니다. 버킷이 용량까지 채워지면 여분의 토큰을 모두 버려집니다.

위의 방법은 토큰버킷알고리즘 구현 방법의 한 예시이고 저희는 애플리케이션의 요구 사항에 맞게 토큰 버킷의 용량과 토큰 채움 비율, 전송되는 데이터의 크기와 형식을 고려하여 앞으로의 프로젝트에서에서는 이러한 방법을 고려하여 소켓을 사용할 계획입니다.

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
- react-redux
- React Router
- [Styled Components](https://reactnative.dev/docs/stylesheet)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- socket.io-client
- ESLint
- Firebase

### Backend

- [Node.js](https://nodejs.org/ko/)
- [Express](https://expressjs.com/ko/)
- [MongoDB](https://www.mongodb.com/cloud/atlas/register)
- [Mongoose](https://mongoosejs.com/)
- Socket.IO
- AWS S3
- ESLint

<br>
<br>

# ✅ Test

- Frontend: React Testing Library, Jest
- Backend: Jest, Supertest
- E2E: Puppeteer, Jest

<br>
<br>

# 🚀 Deployment

- Server: [AWS Elastic Beanstalk](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/Welcome.html)
- Client: [Netlify](https://www.netlify.com/)

<br>
<br>

# 🏠 Members

- [이상혁](https://github.com/HyukE) : mign2ki2@gmail.com
- [정영빈](https://github.com/oyobbeb) : oyobbeb@gmail.com
- [허수빈](https://github.com/shuh319) : shuh319@gmail.com
