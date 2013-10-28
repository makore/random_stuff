package makore.spring_app.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class UpdateSheduler {
	@Autowired
	private DeferredResultContainer deferredResultContainer;

	@Scheduled(fixedRate = 5000)
	public void process() {
		// TODO
		String valueFromJMS = "Quote value.";
		deferredResultContainer.updateAllResults(valueFromJMS);
	}
}
