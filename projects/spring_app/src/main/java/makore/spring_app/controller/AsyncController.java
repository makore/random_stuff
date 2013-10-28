package makore.spring_app.controller;

import makore.spring_app.service.impl.DeferredResultContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.concurrent.Callable;

@Controller
public class AsyncController {

	@Autowired
	private DeferredResultContainer deferredResultContainer;

	@RequestMapping(value = "/quote", method = RequestMethod.GET)
	@ResponseBody
	public DeferredResult<String> getQuote() {

		final DeferredResult<String> deferredResult = new DeferredResult<>();
		deferredResultContainer.add(deferredResult);

		// Run in other thread
		deferredResult.onTimeout(new Runnable() {
			@Override
			public void run() {
				deferredResultContainer.remove(deferredResult);
			}
		});

		deferredResult.onCompletion(new Runnable() {
			@Override
			public void run() {
				deferredResultContainer.remove(deferredResult);
			}
		});
		return deferredResult;
	}


	@RequestMapping(value = "/uploadAsync", method = RequestMethod.POST)
	public Callable<String> uploadFile(@RequestParam("file") final MultipartFile file,
	                                   final HttpServletRequest request) {
		return new Callable<String>() {
			@Override
			public String call() throws Exception {
				if (!file.isEmpty()) {
					final String path = request.getSession().getServletContext().getRealPath("/");
					final String fileName = file.getOriginalFilename();
					try (FileOutputStream fos = new FileOutputStream(path + File.separator + fileName);) {
						FileChannel out = fos.getChannel();
						ByteBuffer buff = ByteBuffer.allocateDirect(file.getBytes().length);
						out.write(buff);
						out.force(false);
						buff.clear();
					}
					return "redirect:success.html";
				} else {
					// TODO
					return "";
				}
			}
		};
	}
}
