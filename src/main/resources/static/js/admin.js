//clear 버튼 동작입니다. -> input 요소 초기화
const clear = function(){
    document.querySelector('#id').value=''
    document.querySelector('#name').value=''
    document.querySelector('#password').value=''
    document.querySelector('#email').value=''
    document.querySelector('#birth').value='1999-01-01'
    document.querySelector('#regdate').value=''
    document.querySelectorAll('.subjects').forEach(item => item.checked =false)
    document.querySelector('#default').innerHTML =`<div class="card-header" id="chatBot">여기에 메시지가 나타납니다.</div>`
    document.querySelector('#idMessage').innerHTML = `<span class="text-sm"></span>`
}

document.querySelector('#clear').addEventListener('click',clear)
//콜백함수는 메소드 또는 함수안에서 인자로 사용되는 함수                            ㄴ 이게 콜백 함수
//addEventListener 는 클릭이 발생하면 실행시킬 clear 함수를 등록합니다.(브라우저에게 알려줌)
//브라우저는 #clear 의 클릭이 발생하는지 listener(감시)하고 있다가 사용자가 클릭하면
// clear 함수를 큐(자료구조)에 저장 합니다. (FIFO - 선입선출)
//브라우저 스케줄링을 통해서 큐에 저장된 함수들을 순서대로 실행시켜 줍니다.
//큐에 저장하는 순서와 실행 순서는 개발자가 예측한 순서와 다를 수 있습니다.

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

//selectAll 버튼
const selectAll =function(){
    const xhr = new XMLHttpRequest()      //비동기 통신 객체 생성
    xhr.open('GET','/api/admin/bookusers')    //전송 보낼 준비 (url과 method)
    xhr.send()                        //요청 전송. body와 함께 보낼 때가 있습니다.
    xhr.onload=function(){               //요청에 대한 응답받았을 때 이벤트 onload 핸들러 함수
        if(xhr.status === 200 || xhr.status ===201){    // readyState 가 DONE(OK)
            const list = JSON.parse(xhr.response)       //자바스크립트 객체의 배열로 변환 (★역직렬화)
            //console.log("get /api/admin/bookusers" , list)    //콘솔 확인용
            makeList(list)  //makeList 함수는 아래에 있음
        } else {
            console.error('오류1',xhr.status)
            console.error('오류2',xhr.response)
        }
    }
}
document.querySelector('#selectAll').addEventListener('click',selectAll)

//-------------------------------------------------------------------------------------------------------------------//

//응답받은 회원 목록을 태그로 출력하는 함수입니다.
const makeList = function (list){         //list 는 dto타입과 동일한 자바스크립트 객체 배열입니다.
    // console.log(list);

    document.querySelector('tbody').innerHTML =''         //테이블의 기존 내용은 clear
    //  전달받은 list 를 각 항목을 table td 태그로 출력
    list.forEach(item => {    //배열에서 하나 가져온 member
        const $tr = document.createElement("tr");
        const $temp=
            `<td>${item.r}</td>
             <td>${item.id}</td>
             <td>${item.name}</td>
             <td>${item.email}</td>
             <td>${item.birth}</td>
             <td>${item.reg_date}</td>
             <td>${item.subjects}</td>` ;
        $tr.innerHTML=$temp;
        document.querySelector('tbody').appendChild($tr);
    });
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

//아이디로 조회
const selectOne = function() {
    const xhr = new XMLHttpRequest()    //비동기 통신 객체 생성
    const id = document.getElementById('id').value
    xhr.open('GET','/api/bookuser/'+id)
    xhr.send()
    xhr.onload=function(){
        if(xhr.status === 200 || xhr.status ===201){
            const result = JSON.parse(xhr.response)
            resultOne(result)
            document.querySelector('#idMessage').innerHTML = `<span class="text-sm"></span>`
        } else {
            console.error('오류1',xhr.status)
            console.error('오류2',xhr.response)
        }
    }
}

const resultOne = function(result){
    document.querySelector('#id').value=result.id
    document.querySelector('#name').value=result.name
    document.querySelector('#password').value=result.password
    document.querySelector('#email').value=result.email
    document.querySelector('#birth').value=result.birth
    document.querySelector('#regdate').value=result.reg_date
    arrSubject.splice(0,arrSubject.length)
    document.querySelectorAll('.subjects').forEach(item => {
        // if(result.subjects.indexOf(item.value) >= 0) //indexOf ▶ return int
        //     item.checked = true
        if(result.subjects.includes(item.value)) {    //includes ▶ return boolean
            item.checked = true                     //contains ▶ js에서 사용 불가 X
            arrSubject.push(item.value) //조회한 관심 분야로 배열 초기화
        } else
            item.checked = false
    })
    document.querySelector('#default').innerHTML =`<div class="card-header" id="chatBot">여기에 메시지가 나타납니다.</div>`
}

document.querySelector('#selectOne').addEventListener('click',selectOne)

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

//관심분야 선택 check 로 문자열 만들기
const arrSubject = []   //arrSubject.toString() 은 배열 요소로 문자열을 만들어준다. (★ POST 에서 사용하기)
const checkSubject = e => { // == const checkSubject = function(e) {
    e.stopPropagation()

    const target = e.target
    if(target.tagName !== 'INPUT') return

    if(target.checked) arrSubject.push(target.value)    //체크 상태이면 배열에 넣기
    else {
        const index = arrSubject.indexOf(target.value);   //해당 값의 배열 위치를 알아내기
        if(index !== -1) arrSubject.splice(index,1)     //해당 위치에서 삭제하기
    }
    // console.log(arrSubject) //클릭하면서 결과를 콘솔에서 확인하세요
}

//id 'checkSubjects'는 checkbox input 모두를 포함하고 있는 div 태그이다.
//checkbox 요소가 많으므로 부모 요소에 이벤트를 주는 방식으로 한다.
document.querySelector('#checkSubjects').addEventListener('click',checkSubject)

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

//ID 중복확인 함수 : idCheck()
let isValid = false   //리턴 변수
function idCheck() {    //함수 선언을 이렇게 하면 끌어올리기 가능 O
    const id = document.querySelector('#id').value

    if(!id) {
        alert('아이디를 입력하세요')
        document.querySelector('#idMessage').innerHTML = `<span class="text-sm"></span>`
        return
    }

    const xhr = new XMLHttpRequest()    //비동기 통신 객체 생성
    xhr.open('GET','/api/bookuser/check/'+id)   //전송 보낼 준비 (URL 과 method)
    xhr.send()
    xhr.onload = function (){
        if(xhr.status === 200 || xhr.status === 201){
            //json 문자열 ▶ 자바스크립트 객체
            const result = JSON.parse(xhr.response) //map 객체를 parse(★역직렬화)
            console.log('응답 : ',result.exist)
            //서버 응답 exist 값으로 isValid 저장. 존재하면 새로운 회원은 사용할 수 없는 아이디
            isValid = !result.exist   //result.exist 리턴타입 : boolean
            let resultMsg
            let resultColor
            if (isValid){
                resultMsg = '없는 ID 입니다. 회원가입이 가능합니다.'
                resultColor = 'blue'
            } else {
                resultMsg = '중복된 ID 입니다. 회원가입이 불가능합니다.'
                resultColor = 'red'
            }
            document.querySelector('#idMessage > span').innerHTML = resultMsg
            document.querySelector('#idMessage > span').style.color = resultColor
        } else {
            console.error('오류',xhr.status,xhr.response)
        }
    }
    return isValid    //사용할 수 있으면 true
}

document.querySelector('#id').addEventListener('keyup',idCheck)

//회원 등록 : POST
const save = function(){    //리터럴 형식의 함수 선언 (끌어올리기 불가능 X , 변수처럼 사용하기 전에 선언)
    const xhr = new XMLHttpRequest()    //비동기 통신 객체 생성

    const id = document.getElementById('id').value
    //ID 중복확인

    let yn = false
    if(id.length == 0){
        alert('ID 는 공백이 될 수 없습니다.')
        return
    } else if(!isValid){
        alert('이미 사용중인 ID 입니다.')
        return
    } else {
        yn = confirm(`ID '${id}' 로 회원가입 하시겠습니까?`)
        if(!yn) return  //confirm 에서 취소 누르면 false
    }

    //1. 입력값 가져오기
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const birth = document.getElementById('birth').value
    const password = document.getElementById('password').value

    //2. 입력값으로 자바스크립트 객체 생성 (자바스크립트 객체는 미리 타입을 정의하지 않고 사용할 수 있다.)
    let json = {
        id:id,
        name:name,
        password:password,
        birth:birth,
        email:email,
        subjects:arrSubject.toString()
    }

    //3. 자바스크립트 객체를 json 전송을 위해 ★직렬화 (문자열로 변환)
    const jsStr = JSON.stringify(json)

    //4. 전송 보낼 준비 (URL 과 method)
    xhr.open('POST','/api/bookuser')
    xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
    xhr.send(jsStr) //5. 요청 전송
    xhr.onload = function() {
        const resultObj = JSON.parse(xhr.response)
        if(xhr.status === 200 || xhr.status === 201){
            if(resultObj.count == 1){
                clear() //정상 등록 후 입력 요소 초기화
                document.querySelector('.card-header').innerHTML = '새로운 회원 ['+id+'] 가입되었습니다.'
                document.querySelector('.card-header').style.color = 'blue'
            }
        } else {
            console.error('오류1',xhr.status)
            console.error('오류2',xhr.response)

            const values = Object.values(resultObj) //자바스크립트 객체는 key , value 구성. 그 중에 value만 가져와서 배열로 만든다.
            let resultMsg = ''
            values.forEach(msg => resultMsg += msg + "<br>")

            document.querySelector('.card-header').innerHTML = resultMsg
            document.querySelector('.card-header').style.color = 'red'
        }
    }
    setTimeout(clear,7000)  //1000 = 1초
}

document.querySelector('#save').addEventListener('click',save)

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

//회원 삭제 : DELETE
const deleteUser = function () {
    const xhr = new XMLHttpRequest()

    const id = document.getElementById('id').value

    xhr.open('DELETE','/api/bookuser/'+id)
    xhr.send()
    xhr.onload=function(){
        const result = JSON.parse(xhr.response)
        let rstCount = Object.values(result)
        if((xhr.status === 200 || xhr.status ===201) && rstCount == 1){
            document.querySelector('.card-header').innerHTML = '['+id+'] 회원이 삭제되었습니다.'
            document.querySelector('.card-header').style.color = 'blue'
        } else {
            console.error('오류1',xhr.status)
            console.error('오류2',xhr.response)

            let resultMsg = '삭제 실패 : '

            if(id.length == 0)
                resultMsg += 'ID 를 입력하세요'
            else
                resultMsg += '존재하지 않는 ID'

            document.querySelector('.card-header').innerHTML = resultMsg
            document.querySelector('.card-header').style.color = 'red'
        }
    }
    setTimeout(clear,7000)  //1000 = 1초
}

document.querySelector('#delete').addEventListener('click',deleteUser)

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

//실제 프로젝트 할 때는 패스워드 , 이메일 변경 1개 필드를 변경할 때 [모달]을 사용하여 입력값 받기
//1개씩 변경하기 버튼
const changeOneField = function (e) {
    e.stopPropagation()
    const target = e.target

    if (target.tagName != 'BUTTON') return

    const field = target.getAttribute("data-num")
    const id = document.querySelector('#id').value  //where 에 필요한 id
    let value = ''

    if(field == 'subjects') //변경하려는 필드가 '관심분야' 일 경우
        value = arrSubject.toString()
    else
        value = document.getElementById(field).value    //field = 변수명

    console.log("field : ",field)
    console.log("value : ",value)

    const jsObj = {
        id:id   //① id : 프로퍼티 이름 ② id : 변수명
    }
    jsObj[field] = value    //jsObj 객체에 새로운 프로퍼티 field와 그 값 추가
    console.log("jsObj 중간 확인 : ",jsObj)

    const jsStr = JSON.stringify(jsObj)
    console.log(jsStr)

    const xhr = new XMLHttpRequest()
    xhr.open('PATCH','/api/bookuser/'+field+'/'+id)
    xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8")
    xhr.send(jsStr)
    xhr.onload = function () {
        const result = JSON.parse(xhr.response)
        if (xhr.status === 200 || xhr.status === 201){
            if(result.count == 1){
                document.querySelector('.card-header').innerHTML = '['+id+'] 님의 ['+ field +'] 정보 수정이 완료되었습니다.'
                document.querySelector('.card-header').style.color = 'blue'
            } else {
                console.log('오류1-',xhr.response)
                console.log('오류2-',xhr.status)

                const values = Object.values(result);
                console.log(values)

                let resultMsg =''
                values.forEach(msg => resultMsg += msg +"<br>")

                document.querySelector('.card-header').innerHTML = resultMsg
            }
        }
    }
}

document.querySelector('.card-body').addEventListener('click',changeOneField)

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━//

//여러개 변경 : PATCH
const update = function (){
    const xhr = new XMLHttpRequest()
    const id = document.getElementById('id').value
    const password = document.getElementById('password').value
    const email = document.getElementById('email').value
    const birth = document.getElementById('birth').value

    let json = {
        id:id,
        password:password,
        birth:birth,
        email:email,
        subjects:arrSubject.toString()
    }

    const jsStr = JSON.stringify(json)

    xhr.open('PATCH','/api/bookuser/'+id)
    xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");
    xhr.send(jsStr)
    xhr.onload = function (){
        const result = JSON.parse(xhr.response)
        if(xhr.status === 200 || xhr.status === 201){
            if(result.count == 1){
                clear()
                document.querySelector('.card-header').innerHTML = '['+id+'] 님의 정보가 수정되었습니다.'
                document.querySelector('.card-header').style.color = 'blue'
            }
        } else {
            console.error('오류1',xhr.status)
            console.error('오류2',xhr.response)

            const values = Object.values(result)
            let resultMsg = ''
            values.forEach(msg => resultMsg += msg + "<br>")

            document.querySelector('.card-header').innerHTML = resultMsg
            document.querySelector('.card-header').style.color = 'red'
        }
    }
}

document.querySelector('#update').addEventListener('click',update)