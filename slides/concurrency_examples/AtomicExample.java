package ua.pc.presentacion.ejemplosconcurrencia;

import java.util.concurrent.atomic.AtomicInteger;

public class AtomicExample {

	/*
	 * Destinado a hacer operaciones no atomicas sobre atributos,
	 * de forma más eficiente que utilizando un bloque synchronized.
	 * Envoltorio sobre atributos volatile
	 */
	private final AtomicInteger atomicCounter = new AtomicInteger(0);

	private volatile int counter = 0;
	private final Object counterLock = new Object();

	public void demo1() {
		synchronized (counterLock) {
			counter++;

			// operación no atómica
			if (counter == 1) {
				counter = 2;
			}
		}
	}

	/*
	 * Mucho más rápido y eficiente
	 */
	public void demo2() {
		int val1 = atomicCounter.addAndGet(1);
		atomicCounter.compareAndSet(1, 2);
		int val2 = atomicCounter.getAndAdd(1);
		int val3 = atomicCounter.incrementAndGet();
		atomicCounter.set(5);
	}
}
