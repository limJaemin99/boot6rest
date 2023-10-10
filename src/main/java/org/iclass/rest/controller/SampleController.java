package org.iclass.rest.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Log4j2
@Controller
@RequestMapping("/sample")	//url 이 community 로 시작하면 DicpatcherServlet 으로부터 
								//	CommunityController 가 위임 받아 처리한다.
public class SampleController {

	@GetMapping("/hello")
	public void hello(Model model) {
		model.addAttribute("message","안녕하세요");
		model.addAttribute("list", List.of("모모","나연","nana","쯔위"));
	}


	@GetMapping("/spring")
	public void spring(@RequestParam(required = false) String name,
					   @RequestParam(required = false) Integer age) {
		log.info("파라미터 name : {}",name);
		log.info("파라미터 age : {}",age);
	}

}
