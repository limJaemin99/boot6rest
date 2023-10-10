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
		BookUser bookUser = bookUserMapper.selectOne(id);
		log.info("━━━━━━━━━━ path variable id : {}",id);

		return bookUser;	//bookUser DTO 를 json 문자열로 변환시켜 전달한다. (★직렬화)
	}

	@DeleteMapping("/bookuser/{id}")
	public Map<String, Integer> delete(@PathVariable String id){
		log.info("━━━━━━━━━━ path variable id : {}",id);
		int result = bookUserMapper.delete(id);
		Map<String,Integer> resultMap = new HashMap<>();
		resultMap.put("delete result",result);

		return resultMap;
	}

}
