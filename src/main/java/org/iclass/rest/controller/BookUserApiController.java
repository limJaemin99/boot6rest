package org.iclass.rest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import lombok.RequiredArgsConstructor;
import org.iclass.rest.dao.BookUserMapper;
import org.iclass.rest.dto.BookUser;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import javax.validation.Valid;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
public class BookUserApiController {

	private final BookUserMapper bookUserMapper;

	@GetMapping("/admin/bookusers")
	public List<BookUser> members() {
		List<BookUser> list = bookUserMapper.selectAll();
		
		return list;
	}
	
	@PostMapping("/bookuser")	//요청에는 헤더와 바디가 있다. @RequestBody 는 bookUser 가 요청의 body 라고 알려준다.
	public Map<String,Integer> save(@RequestBody @Valid BookUser bookUser){	//▲ 클라이언트가 보낸 json 문자열을 자바 객체로 자동 변환 (★역직렬화)
		log.info("━━━━━━━━━━ request body : {}",bookUser);

		int count = bookUserMapper.insert(bookUser);
		Map<String,Integer> resultMap = new HashMap<>();	//처리 결과를 응답하기 위한 Map
		resultMap.put("count",count);

		return resultMap;
	}

	@GetMapping("/bookuser/{id}")
	public BookUser selectOne(@PathVariable String id){
		log.info("━━━━━━━━━━ path variable id : {}",id);

		BookUser bookUser = bookUserMapper.selectOne(id);

		return bookUser;	//bookUser DTO 를 json 문자열로 변환시켜 전달한다. (★직렬화)
	}
	@GetMapping("/bookuser/check/{id}")
	public Map<String,Boolean> check(@PathVariable String id){
		log.info("━━━━━━━━━━ path variable id : {}",id);

		int count = bookUserMapper.isExist(id);
		Map<String,Boolean> resultMap = new HashMap<>();
		resultMap.put("exist",count == 1);

		return resultMap;	//bookUser DTO 를 json 문자열로 변환시켜 전달한다. (★직렬화)
	}

	@DeleteMapping("/bookuser/{id}")
	public Map<String, Integer> delete(@PathVariable String id){
		log.info("━━━━━━━━━━ path variable id : {}",id);

		int result = bookUserMapper.delete(id);
		Map<String,Integer> resultMap = new HashMap<>();
		resultMap.put("delete result",result);

		return resultMap;
	}

	@PatchMapping("/bookuser/{field}/{id}")
	public Map<String,Object> changeOneField(@PathVariable String field,
											 @PathVariable String id,
											 // ▼ DTO에 담는 이유 : 데이터는 1개이지만 유효성 검사를 위해
											 @RequestBody @Valid BookUser bookUser){
		Map<String,Object> map = new HashMap<>();
		map.put("field",field);
		map.put("id",id);
		switch (field){
			case "email" -> map.put("value",bookUser.getEmail());
			case "birth" -> map.put("value",bookUser.getBirth());
			case "password" -> map.put("value",bookUser.getPassword());
			case "subjects" -> map.put("value",bookUser.getSubjects());
		}

		int count = bookUserMapper.changeOneField(map);
		map.put("count",count);

		return map;
	}

	@PatchMapping("/bookuser/{id}")
	public Map<String,Integer> update(@RequestBody @Valid BookUser bookUser){
		int count = bookUserMapper.changeMany(bookUser);

		Map<String,Integer> resultMap = new HashMap<>();
		resultMap.put("count",count);

		return resultMap;
	}

}
