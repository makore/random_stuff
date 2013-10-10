package ua.pc.presentacion.ejemplosconcurrencia;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class CollectionsExample {

	public CollectionsExample() {
		// TODO Auto-generated constructor stub
	}

	class Alert {
		private final String situation;
		private final int level;

		public Alert(String situation, int level) {
			this.situation = situation;
			this.level = level;
		}

		public int getLevel() {
			return level;
		}

		@Override
		public String toString() {
			return "Alert: " + situation + " code " + level;
		}
	}

	enum AlertProvider {
		INSTANCE;

		// private final List<Alert> alerts = new ArrayList<Alert>();
		/*
		 * Es necesario para poder iterar la colección y no se
		 * produzca ConcurrentModificationException.
		 */
		private final List<Alert> alerts = new CopyOnWriteArrayList<>();

		public Collection<Alert> getAlerts() {
			return alerts;
			// return Collections.synchronizedList(alerts);
			/*
			 * Equivale a usar java.util.Vector, aunque es más eficiente
			 * con grandes colecciones y con muchas escrituras.
			 *
			 * Unicamente nos asegura que operar sobre elementos de
			 * la colección se hace de forma sincronizada (el número
			 * de elementos modificados o añadidos es el correcto).
			 *
			 * public void add(int index, E element) {
			 * synchronized (mutex) {
			 * list.add(index, element);
			 * }
			 * }
			 *
			 * Esto no nos libra de ConcurrentModificationException,
			 * al recorrer el array desde otros hilos, puesto que
			 * estamos modificando la colección sobre la cual itera (la
			 * operación no es atómica).
			 *
			 * Solución? copia defensiva? ver checkAlerts().
			 */
		}

		public boolean addAlert(Alert alert) {
			return alerts.add(alert);
		}

		public boolean removeAlert(Alert alert) {
			return alerts.remove(alert);
		}
	}

	/*
	 * Recorro la colección.
	 */
	public void checkAlerts(int id) {
		Collection<Alert> alerts = AlertProvider.INSTANCE.getAlerts();
		/*
		 * CopyOnWriteArrayList funciona así:
		 * Las operaciones de escritura son sincronizadas a través de un
		 * cerrojo.
		 * Existe una referencia al array marcada como volatile.
		 * Cuando un elemento es modificado, se crea internamente
		 * una copia con los datos antiguos de toda la colección, de la cual
		 * podrán leer otros hilos de forma concurrente. Los hilos
		 * lectores no leeran una copia actualizada de la colección
		 * hasta que el hilo escritor haya terminado su operación
		 * de escritura y haya actualizado la referencia a la colección
		 * original marcada como volatile (la operación de asignación
		 * es atómica, por lo tanto es segura entre hilos).
		 *
		 * En el momento en el que el objeto iterador es creado,
		 * la referencia que apunta a la colección nunca cambia.
		 * El iterador no refleja los cambios en la colección
		 * hasta que no se vuelva a instanciar un nuevo iterador.
		 *
		 * Esta técnica resulta más eficiente que englobar toda
		 * la operación en un bloque sincronizado.
		 */
		for (Alert alert : alerts) {
			System.out.println("Thread #" + id + ", Alert level "
					+ alert.getLevel());
		}
	}

	public void addAlert(int id) {
		AlertProvider.INSTANCE.getAlerts().add(new Alert("New alert", id));
	}

	class MyIterThread implements Runnable {

		private int id;

		public MyIterThread(int id) {
			this.id = id;
		}

		@Override
		public void run() {
			checkAlerts(id);
		}
	}

	class MyModThread implements Runnable {

		private int id;

		public MyModThread(int id) {
			this.id = id;
		}

		@Override
		public void run() {
			addAlert(id);
		}
	}

	public AlertProvider getAlertProvider() {
		return AlertProvider.INSTANCE;
	}

	public Alert getNewAlertInstance(String situation, int level) {
		return new Alert(situation, level);
	}

	public MyIterThread getNewIterThreadInstace(int id) {
		return new MyIterThread(id);
	}

	public MyModThread getNewModThreadInstace(int id) {
		return new MyModThread(id);
	}

	public static void main(String[] args) {
		CollectionsExample e = new CollectionsExample();
		e.getAlertProvider().addAlert(e.getNewAlertInstance("Alert A", 110));
		e.getAlertProvider().addAlert(e.getNewAlertInstance("Alert B", 111));
		e.getAlertProvider().addAlert(e.getNewAlertInstance("Alert C", 112));

		final int threads = 100;
		Thread[] tArr1 = new Thread[threads];
		Thread[] tArr2 = new Thread[threads];
		for (int i = 0; i < threads; i++) {
			tArr1[i] = new Thread(e.getNewIterThreadInstace(i));
			tArr2[i] = new Thread(e.getNewModThreadInstace(i));
			tArr1[i].start();
			tArr2[i].start();
		}
		for (int i = 0; i < threads; i++) {
			try {
				tArr1[i].join();
				tArr2[i].join();
			} catch (InterruptedException ex) {
				ex.printStackTrace();
			}
		}

		for (Alert alert : e.getAlertProvider().getAlerts()) {
			System.out.println(alert);
		}
	}

	/*
	 * Otras colecciónes que mejoran el rendimiento en concurrencia
	 * evitando el cuello de botella en la sincronización:
	 * 
	 * ConcurrentHashMap
	 * ConcurrentLinkedQueue
	 * SynchronousQueue
	 * LinkedBlockingQueue (productor-escritor)
	 * ArrayBlockingQueue
	 * PriorityBlockingQueue
	 * BoundedQueue
	 * 
	 * AtomicReferenceArray
	 * StringBuffer (vs StringBuilder no thread-safe)
	 */
}
