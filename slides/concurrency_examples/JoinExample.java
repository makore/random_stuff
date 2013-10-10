package ua.pc.presentacion.ejemplosconcurrencia;

import java.util.concurrent.CountDownLatch;

public class JoinExample {

	private volatile int counter;

	private static final int NUM_THREADS = 3;
	private static volatile CountDownLatch latch;

	static {
		latch = new CountDownLatch(NUM_THREADS);
	}

	class MiHilo implements Runnable {
		@Override
		public void run() {
			// ...
			counter++;
		}
	}

	class MiHiloCDL implements Runnable {
		@Override
		public void run() {
			//...
			counter++;
			latch.countDown();
		}
	}

	public void demoJoin() throws InterruptedException {
		final Thread t1 = new Thread(new MiHilo());
		final Thread t2 = new Thread(new MiHilo());
		final Thread t3 = new Thread(new MiHilo());
		t1.start();
		t2.start();
		t3.start();
		t1.join();
		t2.join();
		t3.join();

		System.out.println("El resultado es: " + counter);
	}

	public void demoCDL() throws InterruptedException {
		for (int i = 0; i < NUM_THREADS; i++) {
			new Thread(new MiHiloCDL()).start();
		}
		latch.await();

		System.out.println("El resultado es: " + counter);
	}

	/*
	 * Ver también CyclicBarrier:
	 * Establece una condición de espera (barrera) dentro de los hilos suscritos
	 * a esa condición. Hasta que todos los hilos no hayan alcanzado dicha
	 * barrera, no podrán continuar su ejecución.
	 */
}
