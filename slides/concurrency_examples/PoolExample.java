package ua.pc.presentacion.ejemplosconcurrencia;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class PoolExample {

	private static final AtomicInteger counter = new AtomicInteger();

	public PoolExample() {
		// TODO Auto-generated constructor stub
	}

	private static void testAtomicInt() throws InterruptedException,
			ExecutionException {
		final int runs = 1000000;
		final int threads = 8;
		/*
		 * Propicio cuando queremos lanzar muchos hilos concurrentemente.
		 * En el ejemplo solo permitimos que se ejecuten tantos hilos 
		 * como procesadores tengamos.
		 * Aprovechamos las instancias de hilos ya creados para lanzar
		 * los nuevos.
		 */
		ExecutorService pool = Executors.newFixedThreadPool(Runtime
				.getRuntime().availableProcessors());
		final ArrayList<Callable<Void>> tasks = new ArrayList<Callable<Void>>();
		for (int t = 0; t < threads; t++) {
			tasks.add(new Callable<Void>() {
				@Override
				public Void call() throws Exception {
					counter.incrementAndGet();
					return null;
				}
			});
		}
		pool.invokeAll(tasks);
		try {
			/*
			 * Esperamos a que terminen todos los hilos
			 */
			pool.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS);
		} catch (InterruptedException e) {
		}
		pool.shutdown();
	}

	private static void testAtomicIntFutures() throws InterruptedException,
			ExecutionException {
		final int runs = 1000000;
		final int threads = 8;
		ExecutorService pool = Executors.newFixedThreadPool(Runtime
				.getRuntime().availableProcessors());
		ExecutorCompletionService<Void> service = new ExecutorCompletionService<Void>(
				pool);
		List<Future<Void>> futures = new ArrayList<>();
		for (int t = 0; t < threads; t++) {
			futures.add(service.submit(new Callable<Void>() {
				@Override
				public Void call() throws Exception {
					for (int i = 0; i < runs; i++) {
						counter.incrementAndGet();
					}
					return null;
				}
			}));
		}
		for (int i = 0; i < threads; i++) {
			/*
			 * Obtenemos los resultados en el orden en el que terminan
			 * no en el que se lanzan.
			 */
			service.take().get();
			// Some processing here
		}
		pool.shutdown();
	}

	/*
	 * Ver también: ForkJoinPool
	 *
	 * Mejor con hilos que se ejecutan en paralelo (operaciones independientes,
	 * que no incurren en operaciones concurrentes).
	 * Util cuando nuestros hilos realizan operaciones recursivas (cada llamada
	 * recursiva se vuelve a enviar al pool).
	 */
}
