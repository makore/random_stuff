package makore.spring_app.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
public class DeferredResultContainer {

	private final Set<DeferredResult<String>> deferredResults =
			Collections.synchronizedSet(new HashSet<DeferredResult<String>>() );

	public void add(DeferredResult<String> deferredResult) {
		deferredResults.add(deferredResult);
	}

	public void remove(DeferredResult<String> deferredResult) {
		deferredResults.remove(deferredResult);
	}

	public void updateAllResults(String value) {
		for (DeferredResult<String> deferredResult : deferredResults) {
			deferredResult.setResult(value);
		}
	}

}
