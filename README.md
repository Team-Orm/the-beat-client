# 🎶 The Beat

# Introduction

The Beat는 실시간 통신을 이용한 배틀형 리듬게임 웹 어플리케이션입니다.

# 📖 Table of Contents

- [🎶 The beat](#🎶-the-beat)
- [💪 Motivation](#💪-motivation)
- [🔥 Challenges](#🔥-challenges)

* [Canvas API를 통해 리듬게임을 어떻게 구현할까?](#1-canvas-api를-통해-리듬게임을-어떻게-구현할까)
  - [1) Canvas API를 선택한 이유](#1-canvas-api를-선택한-이유)
  - [2) 어떻게 노트를 일정한 속도로 떨어지게 할 것인가?](#2-어떻게-노트를-일정한-속도로-떨어지게-할-것인가)
  - [3) 어떻게 애니메이션을 어떻게 효율적이고 부드럽게 처리할까?](#3-어떻게-애니메이션을-어떻게-효율적이고-부드럽게-처리할까)
  - [4) miss 처리는 어떻게 할까?](#4-miss-처리는-어떻게-할까)
* [Web Audio API를 이용해 오디오를 어떻게 시각화할까?](#2-web-audio-api를-이용해-오디오를-어떻게-시각화할까)
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

# 💪 Motivation

부트캠프에서 8주간 학습했던 기술스택들을 이번 프로젝트에서 심층적으로 사용하고 싶었습니다. 실시간 통신을 이용하고, 시각적으로 재미있는 프로젝트를 고민해보다 리듬게임이라는 아이디어를 생각하였습니다.

기존에 만들어진 리듬게임을 확인해보며 웹으로 직접 리듬 게임을 직접 구현해보고 실시간으로 통신도 하면 팀원들과 재미있게 만들수 있겠다! 라는 생각으로 The Beat 프로젝트를 시작하게 되었습니다.

# 🔥 Challenges

3주간의 프로젝트를 진행하며 여러 Challenges가 있었지만 핵심적인 Challenges는 다음과 같은 요소가 있었습니다.

## 1. Canvas API를 통해 리듬게임을 어떻게 구현할까?

리듬게임을 진행하는 배틀룸에서 부드러운 애니메이션과 정확한 타이밍을 유지하지 위해 노트가 일정한 속도로 떨어지도록 만드는 것은 저희 과제 중 하나였습니다. 그리고 사용자가 노트를 칠 타이밍을 놓쳤을 때 miss처리를 어떻게 할 것인지도 또 하나의 과제였습니다.

<br>

### 1) Canvas API를 선택한 이유

- 그래픽 렌더링: Canvas API는 게임에서 노트, 배경 및 기타 시각적 요소와 같은 그래픽을 생성하고 조작할 수 있는 강력한 2D 드로잉 표면을 제공하여 실시간으로 그래픽을 렌더링하는 유연하고 효율적인 방법을 제공합니다.
- 브라우저 지원: Canvas API는 HTML5 표준의 일부이며 모든 최신 웹 브라우저에서 지원되어 추가 플러그인이나 설치가 필요하지 않습니다.
- 사용 편의성: 비교적 쉽게 배우고 사용할 수 있어 도움이 되는 많은 튜토리얼과 리소스가 제공됩니다. 따라서 더 복잡한 그래픽 프레임워크를 다루는 대신 게임 메커니즘과 사용자 경험에 집중할 수 있습니다.
- 성능: Canvas API는 많은 브라우저에서 하드웨어 가속(hardware-acceleration)을 지원하여 부드럽고 반응이 빠른 그래픽 렌더링을 제공합니다. 이는 정확한 타이밍과 부드러운 애니메이션으로 사용자 경험에 기여합니다.
- 상호 운용성: Canvas API는 자바스크립트, CSS, Web Audio API와 같은 다른 웹 기술과 함께 사용할 수 있으므로 오디오, 시각 효과, 사용자 인터페이스 요소로 풍부하고 인터랙티브한 게임 경험을 만들 수 있습니다.

<br>

### 2) 어떻게 노트를 일정한 속도로 떨어지게 할 것인가?

비디오 게임 초창기에는 일부 프로그램의 속도가 컴퓨터 프로세서의 속도에 따라 달라지는 문제를 해결하기 위해 나온 방법은 시간 기반 애니메이션(Time-based Animation)입니다. 시간 기반 애니메이션은 프레임 기반 증분 대신 시간을 기준으로 오브젝트에 애니메이션을 적용하는 방법입니다. 프레임 속도에 관계없이 노트가 일정한 속도로 떨어지도록 하기 위해서 "델타 타임"이라는 개념을 사용해 프레임 사이의 경과 시간을 기준으로 노트 이동 속도를 조정하였습니다. 델타타임은 마지막 프레임 이후 시간이 경과한 것을 추적하는 것으로 델타(delta)는 시간의 차이를 의미합니다. 델타가 확보되면 다음 공식을 사용하여 물체가 이 프레임을 이동해야 하는 거리를 파악할 수 있습니다.
델타가 확보되면 다음 공식을 사용하여 물체가 이 프레임을 이동해야 하는 거리를 파악할 수 있습니다.

```javascript
const distance = speed * delta;
```

distance: 프레임을 이동할 픽셀 수
speed: 속도(픽셀/초)
delta: 마지막 프레임 이후 경고한 시간(초)

다음의 예시 코드는 bullet의 x위치가 각 프레임에서 어떻게 계산되는지 보여줍니다.

```javascript
const distance = APP.bullet.speed * APP.core.delta;
APP.bullet.x = APP.bullet.x - distance;
```

다음은 프로젝트에서 실제로 델타 타임을 적용하여 노트를 업데이트하는 코드입니다.

```javascript
const updateNotes = () => {
  const now = Date.now(); //밀리초로 현재 타임스탬프를 얻음

  if (!deltaRef.current) {
    deltaRef.current = now; //deltaRef.current가 세팅되지 않았다면 deltaRef.current를 현재 타임스탬프로 설정
  }

  ctx?.clearRect(0, 0, canvas.width, canvas.height); //ctx 객체가 존재한다면 모든 캔버스 영역을 clear
  timeRef.current += (now - deltaRef.current) / MILLISECOND; //마지막 업데이트 이후 경과 시간을 사용하여 현재 시간을 업데이트
  const visibleNotes = notes.filter((note) => note.time <= timeRef.current); //시간 속성을 기준으로 표시되는 노트 필터링

  renderNotes(now, deltaRef.current, ctx, visibleNotes); //켄버스에 시간 속성을 기준으로 표시되어야할 노트 렌더링

  if (timeRef.current >= songDuration) {
    //노래의 재생 시간이 다 되었는지 확인
    navigate(`/battles/results/${roomId}`); // 재생 시간이 다 된 경우 결과 페이지로 이동

    if (
      !songHasEnded &&
      (comboResults.excellent > 0 || comboResults.good > 0)
    ) {
      dispatch(isSongEnd({ comboResults, currentScore, maxNotesNumber }));
    }

    setSongHasEnded(true);
  } else {
    animationFrameId = requestAnimationFrame(updateNotes); //다음 애니메이션 프레임을 요청하고 업데이트 노트를 재귀적으로 호출
  }

  deltaRef.current = now; //현재 타임스탬프로 deltaRef.current 업데이트
};
```

<br>

### 3) 어떻게 애니메이션을 어떻게 효율적이고 부드럽게 처리할까?

저희 프로젝트에서는 프레임을 반복적으로 호출하기 위해 setInterval 또는 회기적인 setTimeout을 사용하는 대신, requestAnimationFrame() 메서드를 사용하였습니다. setInterval과 setTimeout은 시간이 정확하지 않을 수 있으며, 실제 실행 시간은 브라우저와 시스템 상태에 따라 다를 수 있습니다.
또한 브라우저의 화면 리프레시와 동기화되지 않기 때문에, 애니메이션의 경우 frame rate가 일정하지 않을 수 있으며, frame drop이나 불필요한 리소스 사용이 발생할 수 있습니다.

requestAnimationFrame(callback)은 브라우저가 다음 화면 리프레시 직전에 콜백 함수를 실행하도록 예약합니다. 그리고 이를 통해 브라우저의 리프레시 레이트와 동기화되어 최적의 애니메이션 및 게임 루프를 제공합니다.
저희 프로젝트는 정확한 시간의 값이 필요하므로 requestAnimationFrame()을 사용하였습니다. requestAnimationFrame()은 애니메이션 루프의 정밀한 타이밍을 제공합니다. 일반적으로 millisecond 단위의 정밀도를 가진 setTimeout()과 비교했을 때, requestAnimationFrame()은 애니메이션 프레임을 실제로 화면에 그리기 전에 콜백 함수를 실행합니다. 따라서 더 정확한 타이밍을 얻을 수 있어 배틀룸에서 노트가 떨어지는 애니메이션과 배경으로 오디오시각화를 위해requestAnimationFrame()를 사용하기로 했습니다.

```javascript
function animate() {
  // 애니메이션화할 요소들

  requestAnimationFrame(animate);
}
animate();
```

<br>

### 4) miss 처리는 어떻게 할까?

프로젝트 도중 노트를 설정한 범위에 입력하지 않으면 miss처리를 해주었습니다. 모든 노트에 대해서 입력을 해주면 프로젝트가 정상적으로 작동하였지만 노트를 입력하지 않으면 오류는 생기지 않았지만 프로그램이 정상적으로 작동을 하지 않는 현상을 발견하여 문제점을 찾아보고 추적해보니 노트를 입력하지 않았을 경우 문제가 발생하였습니다. 그리고 이부분에서 miss로 예외처리를 해주기 위해서는 해당 노트의 위치를 업데이트 하고 노트가 캔버스 하단을 벗어났을때 miss 처리를 해주는 부분에서 어려움이 있었고 아래와 같은 방법으로 해결해 주었습니다.

```javascript
const update = useCallback(
  (now, delta, ctx, note) => {
    //변수는 현재 시간(now)과 이전 프레임 시간(delta) 사이의 시간 차이를 계산(노트의 이동 속도를 계산)
    const diffTimeBetweenAnimationFrame = (now - delta) / MILLISECOND;
    //note 객체가 전달되면, 노트의 위치(positionY)를 업데이트(이 위치는 이동 속도(SPEED)와 시간 차이를 곱한 값으로 증가)
    if (note) {
      note.positionY += diffTimeBetweenAnimationFrame * SPEED;
    }
    /*
    노트가 캔버스의 높이를 초과하는지 확인(note.positionY >= canvas?.height). 만약 노트가 캔버스 하단을 벗어났다면, 다음 작업을 수행
    노트의 시간이 현재 시간에서 최대 허용 타이밍(SPEED / DIFFICULTY)을 뺀 값보다 작은 경우, "miss" 처리를 수행
    콤보 카운터(comboRef.current)를 0으로 초기화
    comboResults.miss를 1 증가시켜 놓치게 된 노트의 수를 기록
    notesRef.current와 setNotes에서 해당 노트를 제거
    "miss"를 화면에 표시하기 위해 setWord 함수를 호출
    */
    if (note.positionY >= canvas?.height) {
      if (note.time < timeRef.current - SPEED / DIFFICULTY) {
        comboRef.current = 0;
        comboResults.miss += 1;
        notesRef.current = notesRef.current.filter((n) => n !== note);
        setNotes((prev) => prev.filter((n) => n !== note));
        setWord(() => "miss");
      }
      //노트가 캔버스 하단을 벗어나지 않았다면, render 함수를 호출하여 노트를 그림
    } else {
      return render(ctx, note);
    }
  },
  [canvas?.height, comboResults, render],
);
```

<br>
<br>

## 2. Web Audio API를 이용해 오디오를 어떻게 시각화할까?

저희 프로젝트에서는 플레이어가 게임을 플레이할 때 오디오를 시각화하여 플레이어의 게임 몰입도와 참여도를 향상시키고자 하였습니다. HTML에서 <audio> 태그를 이용하면, 오디오를 재생/정지하고 볼륨을 조정할 수 있습니다. 하지만 오디오의 재생위치를 조정하고 재생 완료까지의 이벤트처리까지만 가능합니다. 따라서 저희는 오디오 음원 자체를 컨트롤하고 분석할 수 있는 방법으로 Web Audio API를 선택하였습니다. Web Audio API는 웹에서 오디오에 효과를 추가하거나, 파형을 시각화하는 등 다양한 기능을 구현할 수 있도록 도와줍니다.

<br>

### 1) Web Audio API를 선택한 이유

- 브라우저 호환성: Web Audio API는 최신 웹 브라우저에서 광범위하게 지원되므로 서로 다른 장치와 운영 체제에서 원활하게 작동합니다.
- 강력한 오디오 처리 기능: Web Audio API는 필터, 효과 및 공간화와 같은 오디오 처리 및 조작을 위한 다양한 기능을 제공하여 복잡한 오디오 상호 작용 및 시각화를 만들 수 있습니다.
- 동기화: Web Audio API는 정화한 타이밍과 동기화를 위해 설계되었으며 시각화가 오디오와 정확하게 동기화되어야하는 리듬 게임에서 중요합니다.
- 실시간 분석: Web Audio API는 실시간 오디오 분석을 가능하게 하여 오디오에서 주파수 및 진폭 데이터와 같은 유용한 정보를 추출할 수 있도록 합니다. 시간으로 오디오에 반응하는 동적 시각화를 생성하여 플레이어에게 보다 몰입적인 경험을 제공할 수 있습니다.
- 모듈식 및 확장 가능: Web Audio API는 서로 다른 오디오 노드를 연결하여 복잡한 오디오 처리 체인을 구축할 수 있도록 하는 모듈식 노드 기반 접근 방식을 사용합니다.

<br>

### 2) Web Audio API 기본 원리

Web Audio API를 통해 오디오를 다루는 원리는 다음과 같습니다.
먼저 음원 "source"를 입력받고 오디오 관련 작업을 하고 결과물을 목적지(Destination)로 출력합니다.
이를 위해 Web Audio API는 "소스", "작업", "목적지" 역할을 하는 객체들을 각각 제공하는데 이 객체들은 모두 AudioNode를 상속 받으면서 각자의 역할을 추가로 구현해둔 객체들입니다.

![alt text](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FwAmaN%2FbtrqaJlGsk3%2FHkhBrX2xKO7ijVLUq3ZZ41%2Fimg.jpg)

Web Audio API를 통해 오디오를 다루는 원리는 소스 노드로 생성해 음원을 입력하고 작업 노드를 생성해 오디오 관련 작업을 수행하고 소스노드, 작업노드, 목적지노드를 연결해 출력하는 것입니다.

- AudioContext는 window의 property이므로 전역에서 사용할 수 있습니다.

<br>

### 3) Audio Buffer와 Audio Context

저희 프로젝트에서는 Canvas를 사용하여 Amazon s3 버킷으로부터 링크로 오디오 버퍼를 받아와서 데이터를 프로세스하고 오디오의 주파수와 진폭정보에 기반한 시각화를 렌더링하였습니다.

audioBuffer: audioBuffer 객체는 AudioContext.decodeAudioData()을 사용하여 오디오파일에서 만든 메모리의 짧은 오디오 에셋을 나타냅니다. 저희 프로젝트에서 오디오 버퍼는 노래의 오디오 URL을 가져오고 수신된 ArrayBuffer를 디코딩하여 생성됩니다.
Web Audio API의 컨텍스트에서는 audioBuffer를 사용하여 audioContext 내에서 재생하거나 조작할 수 있는 오디오 샘플을 저장합니다. 이를 통해 오디오 샘플 시작, 중지 및 루프를 포함한 오디오 재생을 정밀하게 제어할 수 있을 뿐 아니라 효과 및 기타 조작을 적용할 수 있습니다.

다음은 출력된 audioBuffer 데이터입니다.
<img width="1079" alt="Screen Shot 2023-03-30 at 12 38 47 AM" src="https://user-images.githubusercontent.com/115068443/228592960-d7eba3c8-d267-4e9a-9a5c-f57c5f71c5ed.png">

audioContext: AudioContext 인터페이스는 각각 AudioNode로 표시되는 함께 연결된 오디오 모듈로 구성된 오디오 처리 그래프를 나타냅니다. AudioContext 포함된 노드의 생성과 오디오 처리 또는 디코딩의 실행을 모두 제어합니다. 모든 것이 컨텍스트 내에서 발생하므로 다른 작업을 수행하기 전에 오디오 컨텍스트를 만들어야합니다.

다음은 저희 프로젝트에서 AudioBuffer를 다루는 예시입니다.

```javascript
// 오디오 데이터를 가져와서 오디오 버퍼로 디코딩하기
if (response.status === 200) {
  const audioData = new Uint8Array(response.data).buffer;
  const { audioContext, source } = createAudioContextAndSource(null);
  const buffer = await audioContext.decodeAudioData(audioData);

  setAudioBuffer(buffer); // 디코딩된 오디오 버퍼로 setState
  source.buffer = buffer; // source에 오디오 버퍼 할당
}
```

아래는 AudioContext를 사용한 부분입니다.

```javascript
// AudioContext와 BufferSource 만들기
const createAudioContextAndSource = useCallback((audioBuffer) => {
  const audioContext = new AudioContext(); // AudioContext 만들기
  const source = audioContext.createBufferSource(); // BufferSourceNode 만들기
  if (audioBuffer) {
    source.buffer = audioBuffer; // source에 오디오 버퍼 할당
  }

  sourceRef.current = source;

  return { audioContext, source };
}, []);

// AudioContext, BufferSourceNode, 및 AnalyserNode를 사용하여 오디오 데이터 시각화
const startVisualization = useCallback(async () => {
  const { audioContext, source } = createAudioContextAndSource(audioBuffer);

```

<br>
<br>

## 3. CORS 문제 해결을 위해 어떻게 프록시 서버를 생성할 수 있을까?

<br>

### 1) 프록시 서버 생성

저희 프로젝트에서는 음악과 이미지URL 저장을 위하여 아마존 웹서비스(AWS)에서 제공하는 클라우드 기반 스토리지 서비스인 AWS S3 를 사용하였습니다. 배틀룸에서 AWS S3 버킷에 저장한 링크를 직접 엑세스하여 Web Audio API와 연결하려고 할 때 CORS문제를 경험하였습니다. CORS는 Cross-Origin Resource Sharing(Cross-Origin Resource Sharing)의 약자로, 웹 브라우저에서 구현된 보안 메커니즘으로 웹 페이지가 페이지를 제공한 도메인이 아닌 다른 도메인에 요청하는 것을 방지합니다.
애플리케이션에서 직접 S3 링크에 엑세스하려고 하면 웹 응용 프로그램의 도메인이 S3 버킷의 도메인과 다르기 때문에 요청이 CORS 요청으로 간주됩니다. 그러면 CORS 매커니즘이 작동되고 브라우저가 요청을 차단하여 잠재적인 보안 위험을 방지합니다. 따라서 저희는 Express.js 프레임워크를 사용하여 CORS 문제를 우회하고 애플리케이션에서 S3링크에 엑세스할 수 있는 간단한 프록시 서버를 설정하였습니다.

<br>

### 2) 프록시 서버란?

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Reverse_proxy_h2g2bob.svg/1200px-Reverse_proxy_h2g2bob.svg.png" alt="image" width="500">

프록시 서버는 클라이언트와 대상 서버 간의 중간 서버입니다. 클라이언트는 프록시 서버로 요청을 보낸 다음 대상 서버로 요청을 전달합니다. 대상 서버의 응답은 프록시 서버로 다시 전송되고 프록시 서버는 이 응답을 클라이언트로 전달합니다. 프록시 서버의 주요 목적은 클라이언트와 대상 서버 사이의 gateway 또는 중개자 역할을 하여 둘 사이의 통신에 대한 추상화 및 제어 계층을 제공하는 것입니다.

저희가 만든 프록시 서버 구조는 클라이언트에서 서버로 요청을 프록시하는데 사용되는 역방향 프록시(reverse proxy)의 예입니다. 이 경우 역방향 프록시 서버는 실제 서버 앞에 배치되어 요청을 가로채 적절한 대상으로 전달합니다. Express.js 프록시 서버의 경우 일반적으로 클라이언트에서 다른 도메인의 서버로 요청을 프록시하기 위해 역방향 프록시를 사용하여 CORS 제한을 무시합니다.

<br>

### 3) 프록시 서버 생성 방법

app.js에서 proxy서버를 위한 라우트를 만들었습니다.

```javascript
const proxyRouter = require("./routes/proxy");

app.use("/proxy", proxyRouter);
```

proxy.js에서는 /proxy/audio-server 경로에 대한 GET요청을 처리하는 Express 라우터를 export합니다.

```javascript
const express = require("express");
const router = express.Router();
const proxyController = require("./controllers/proxy.Controller");

router.get("/audio-server", proxyController.getBuffer);

module.exports = router;
```

다음은 프록시 컨트롤러 모듈의 일부로 버퍼를 가져오는 getBuffer함수입니다.
proxy.Controller.js

```javascript
const axios = require("axios");

exports.getBuffer = async (req, res, next) => {
  const audioURL = req.query.url;

  if (!audioURL) {
    return res.status(400).send("Missing audio URL");
  }

  try {
    if (audioURL) {
      const response = await axios.get(audioURL, {
        responseType: "arraybuffer",
      });

      res.set("Content-Type", "audio/mpeg");
      res.send(response.data);
    }
  } catch (err) {
    next(err);
  }
};
```

위와 같은 과정을 통해 간단한 프록시 서버를 만들어 클라이언트가 /proxy/audio-server?url={audio file URL}로 요청을 보내면 서버는 getBuffer 함수를 사용하여 요청을 대상 서버로 proxy하고 오디오 파일 데이터를 클라이언트로 반환하였습니다.

<br>
<br>

## 4. React Hooks 사용하며 예기치 않은 비동기적인 동작을 예측이 가능하게 처리 할 수 있을까?

프로젝트를 진행하며 React Hooks를 사용할 때 예기치 않은 비동기적 동작을 종종 맞이하였고 이를 어떻게 효율적으로 처리할 수 있을까 고민해 보았습니다.

<br>

### 1) React Hooks이란?

React Hooks은 React 버전 16.8에 도입된 기능으로, React에서 보다 효율적이고 유지 관리 가능한 코드를 작성할 수 있는 강력하고 유연한 기능입니다. React Hooks를 사용하면 기능 구성 요소에서 상태, 컨텍스트 및 기타 React 기능을 사용할 수 있으므로 재사용 가능한 코드를 작성하고 구성 요소를 상태를 관리하는 것이 더 쉬워집니다. 또한 Hooks는 클래스 기반 프로그래밍 대신 함수형 프로그래밍을 사용할 수 있도록 하여 구성 요소의 코드를 단순화합니다. React에는 useState, useEffect, useContext, 및 useCallback와 같은 기본 제공 Hooks가 있습니다. 이런 Hooks의 사용으로 구성 요소 상태를 관리하고 side effects를 수해하며 구성 요소 간에 데이터를 공유할 수 있습니다. 또한 사용자 정의 후크를 생성하여 공톤 논리를 캡슐화하고 구성 요소 간에 재사용할 수 있도록 할 수 있습니다.

<br>

### 2) React Hooks의 기본적인 규칙과 염두에 두어야 할 점

React Hooks의 기본 규칙은 다음과 같습니다.

- 최상위(at the Top Level)에서만 Hook을 호출: 반복문, 조건문 혹은 중첩된 함수 내에서 Hook을 호출하면 안 됩니다.
- 같은 순서로 Hook 호출: Hook을 조건부로 호출하거나 loop 또는 callback 내부에서 호출하지 않아야 합니다.
- 오직 React 함수 내에서 Hook을 호출: Hook을 일반적인 JavaScript 함수에서 호출하면 안 됩니다.
- 조건부로 Hook 사용 안 함: 조건부로 Hook을 사용하거나 모든 렌더링에서 항상 호출되지 않을 수 있는 내부 함수를 사용해서는 안 됩니다.
- 상태를 직접 수정하지 않음: 예기치 않은 동작이 발생할 수 있으므로 상태를 직접 수정해서는 안 됩니다. 상태를 업데이트하려면 항상 useState Hook이 반환하는 setState 함수를 사용합니다.
- useCallback 및 Memo Hook을 사용하여 성능을 최적화: useCallback과 Memo hook을 사용하여 각각 함수와 값을 메모하고 구성 요소의 성능을 향상시킬 수 있습니다.

React Hooks는 많은 이점을 제공하고 React 개발에서 널리 사용되지만 React Hooks를 사용할 때는 다음과 같은 점을 인식하는 게 중요합니다.

- Hooks API이해: React Hooks는 Hooks API에 대한 이해와 올바른 사용법이 필요합니다. 비교적으로 React Hooks는 새로운 기능이기 때문에 기존 클래스 구성 요소에 비해 다큐먼트와 리소스가 적습니다.
- 예기치 않은 동작: 다른 기술과 마찬가지로 React Hooks를 사용할 때 예상치 못한 동작이 발생할 수도 있습니다. 이러한 동작에는 상태 관리, 구성 요소 리렌더 및 메모리 누수 문제가 포함될 수 있습니다.

<br>

### 3) React Hooks를 사용할 때 예기치 않은 비동기적 동작을 처리하기 위한 방법

아래 코드는 프로젝트를 진행하면서 React Hooks를 사용할 때 예기치 않은 비동기적 동작을 처리하기 위해 사용한 방법입니다.

```javascript
useEffect(() => {
  const deleteBattle = async () => {
    const roomId = resultId;
    const response = await axios.delete(
      `${process.env.REACT_APP_SERVER_URL}/api/rooms/${roomId}`,
    );

    if (response.status === 204) {
      console.log("battleroom is deleted");
    }
  };

  deleteBattle();
}, [resultId]);
```

useEffect 내부에서 async 함수 사용한 방법입니다. 비동기 작업을 처리할 때 깔끔하고 명료한 구조를 가질 수 있고, 쉽게 에러 처리를 할 수 있습니다.
단점으로는 컴포넌트 언마운트 시 완료되지 않은 비동기 작업에 대한 처리가 누락되어 메모리 누수가 발생할 수 있습니다.

```javascript
useEffect(() => {
  const socketClient = io(`${process.env.REACT_APP_SOCKET_URL}/results/`, {
    cors: {
      origin: env,
      methods: ["GET", "POST"],
    },
    query: { displayName, photoURL, uid, resultId },
  });
  setSocket(socketClient);

  return () => {
    socketClient.disconnect();
  };
}, [displayName, photoURL, resultId, uid]);
```

useEffect 내부에서 return문을 사용하여 cleanup 함수를 사용하는 방법 입니다.
컴포넌트가 언마운트되기 전에 완료되지 않은 비동기 작업을 취소하려면 useEffect 내부에서 cleanup 함수를 사용할 수 있습니다. 이렇게 하면 컴포넌트가 언마운트되었을 때 완료되지 않은 요청을 취소할 수 있습니다.또한 메모리 누수를 방지 할 수 있습니다.
주의 사항으로는 모든 비동기 작업이 취소 가능한 것은 아닙니다 Promise를 사용하는 경우 취소가 불가능 합니다.

현재 프로젝트 에서는 위두가지 방법으로 React Hooks를 사용할 때 예기치 않은 비동기적 동작을 처리하였습니다.

<br>
<br>

## 5. Socket.IO를 통한 실시간 배틀에서 어떻게 최적화를 해줄 수 있을까?

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

### 프로젝트 기간 : 2023.03.6 ~ 2023.03.29 / 3주

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
