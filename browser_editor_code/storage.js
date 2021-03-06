
// 1. text_area 저장 - 구현 O
// 2. highlight 저장 - 구현 O
// 3. text_area 로드 - 구현 O
// 4. highlight 로드 - 구현 O
// 5. 캡처
// 6. 번역 -> 번역을 highlight 하위로 만들면 자동 해결

// 불러온 태그들이 저장될 태그 생성
var space=document.createElement('p')
space.id="Element";
document.body.appendChild(space);

//북마크 좌표 넣을 공간
var bookMarkArrayX2 = new Array();//x좌표
var bookMarkArrayY2 = new Array();//y좌표

// 페이지 로딩 완료시 함수 작동
window.onload = function () {
	recieveURL(); // 로드
	changeState(); // 페이지 켜졌을때 off 상태가 기본이게 만듬
}

// 로드
function recieveURL(){
	var target_html=null;
	var url_array;
	var current_url=String(window.location);

	chrome.storage.local.get( "search_url" , function(items) {
		console.log("item: " + items.value);
		console.log("recieve/ search_url: "+items.search_url);
		url_array=items.search_url;
		for(var i in url_array){
			console.log("recieve/ url array : "+url_array[i]);
			console.log("recieve/ current_url : "+current_url);
			if(url_array[i]==current_url){
				target_html="eui_"+String(i);
			}

	    }
	    console.log("recieve/ target_html: "+target_html);
	});

	chrome.storage.local.get( target_html , function(items) {
		if (!chrome.runtime.error) {

			eval("console.log('target : '+target_html)");
			eval("console.log('result : '+items."+target_html+")");
			// 비어 있다면 Element 태그 내에 아무것도 안넣음
			eval("document.getElementById('Element').innerHTML= items." + target_html + ";");

			// 불러온 태그들 다시 저장 할때 사용하는 배열에 집어넣어줌
			// textarea 담긴 태그 찾아줌(div)
			var div_area_List=document.getElementsByClassName("div_area_class");
			for(var i = 0; i<div_area_List.length; i++){
				// textarea_array에 불러온 값 넣어줌
				textarea_array.push(div_area_List[i]);
			}

			// highlight 태그 찾아줌
			var highlight_List = document.getElementsByClassName("highlight_class");
			for(var i = 0; i<highlight_List.length; i++){
				// highlight_array에 불러온 값 넣어줌, 두번째 배열 값에 하이라이트된 부분 문자열 넣어줘야함
				highlight_array.push([highlight_List[i], null]);
				var temp_hi=highlight_List[i];
				temp_hi.onmousedown = function(event) {
					current_target=event.target;
				};
			}

			// bookmark 태그 찾아줌
			var jbBook_List = document.getElementsByClassName("jbBook_class");
			for(var i = 0; i<jbBook_List.length; i++){
				// jbBook_array에 불러온 값 넣어줌
				jbBook_array.push((jbBook_List[i]));
			}

			for(var i=0;i<jbBook_array.length;i++){
				//jbBook의 x좌표 불러와서 px자르고 bookMarkArrayX2에 넣기
				splitstring=(jbBook_array[i].style.left).split('px');
				bookMarkArrayX2[i]=splitstring[0];
				
				//jbBook의 y좌표 불러와서 px자르고 bookMarkArrayY2에 넣기
				splitstring2=(jbBook_array[i].style.top).split('px');
				bookMarkArrayY2[i]=splitstring2[0];
			}

			
			var capture_List = document.getElementsByClassName("capture_class");
			for(var i = 0; i<capture_List.length; i++){
			// capture_array에 불러온 값 넣어줌
			capture_array.push(capture_List[i]);
			}
			
			// 불러온 태그에 addEventListener 연결
			// x 버튼 태그들 찾아줌
			var ta_delete_List=document.getElementsByClassName("ta_delete_class");
			for(var i = 0; i<ta_delete_List.length; i++){
				// 삭제 함수 연결
				ta_delete_List[i].addEventListener("click", delete_textarea);
			}

			// jbBook 노드 위치 설정
			for(var i = 0; i<jbBook_List.length; i++){
				arrayLocation++; // 북마크 순서 bookmark.js 참조
				document.body.insertBefore(jbBook_List[i],document.body.childNodes[i]);
			}

			// 위와 마찬가지의 이유
			// capture 드래그앤드롭 연결
			for(var i = 0; i<capture_List.length; i++){
				var temp_capture = capture_List[i];
				temp_capture.onmousedown = function(event) {
					current_target=event.target;
					captureMouseDown(event, temp_capture);
				};
				temp_capture.ondragstart = function() {
					return false;
				};
			}
		}
	});
}
// 저장
function createURL() {
	// textarea_array 는 text_area.js 에 있는 변수임
	// highlight_array 는 selection.js 에 있는 변수임

	// 저장 할때 쓰는 배열 1. text_area 2. highlight 3. bookmark 정보 저장
	// 저장전 이전 저장 값 초기화, storage_html_array 초기화
	var storage_html_array=new Array();
	var target_html="eui_0";
	var url_array;
	var current_url=String(window.location);

	// text_array 저장
	for(var i=0 in textarea_array){
		var temp=textarea_array[i].getElementsByTagName("TEXTAREA");
		temp[0].innerHTML=temp[0].value;
		storage_html_array.push(textarea_array[i].outerHTML);
	}
	// highlight 저장
	for(var i=0 in highlight_array){
		storage_html_array.push(highlight_array[i][0].outerHTML);
	}
	// bookmark 저장
	for(var i=0 in jbBook_array){
		storage_html_array.push(jbBook_array[i].outerHTML);
	}
	// capture 저장
	for(var i=0 in capture_array){
		storage_html_array.push(capture_array[i].outerHTML);
		console.log("capture: "+capture_array[i]);
	}
	

	chrome.storage.local.get( "search_url" , function(items) {
		url_array=items.search_url
		if(url_array == null){
			console.log("first url");
			url_array=new Array();
			url_array.push(current_url);
			target_html="eui_"+"0"
			console.log(url_array);
		}
		else if(url_array.includes(current_url)){
			console.log("include url");
			target_html="eui_"+String(url_array.indexOf(current_url));
		}
		else if(!url_array.includes(current_url)){
			console.log("not include url");
			url_array.push(current_url);
			target_html="eui_"+String(url_array.length-1);
		}
		else{
			console.log("WTF!!!");
		}

		
		console.log("eui check");
		
		
		chrome.storage.local.set({ "search_url" : url_array }, function() {
			console.log("storage/ url_array : "+url_array); 
			console.log("storage/ target_html: "+target_html);
			console.log("storage_html_array :  "+storage_html_array);
        	eval("chrome.storage.local.set({ "+target_html+" : storage_html_array }, function() {})");
    	});
	});


    chrome.storage.local.get( "search_url" , function(items) {
    	console.log("check >>> >< : "+items.search_url);
    });
    
}