package ua.pc.presentacion.ejemplosconcurrencia;

import java.util.concurrent.Semaphore;

/*
 * Monitor con semaforos de la implementacion Java (Semaphores)
 * No probado (no son semáforos binarios).
 */

public class SemaphoresExample {

	class SemaforoVC {

		private Semaphore mutex;
		private Semaphore condicion;

		private int procesosBloqueados;

		public SemaforoVC(Semaphore mutex) {
			this.mutex = mutex;
			this.condicion = new Semaphore(0, true); // true para FIFO
			this.procesosBloqueados = 0;
		}

		public void DELAY() {
			procesosBloqueados++;
			mutex.release(); // signal
			try {
				condicion.acquire(); // wait
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}

		public void RESUME() {
			if (procesosBloqueados > 0) {
				procesosBloqueados--;
				condicion.release();
			} else {
				mutex.release();
			}
		}

		public boolean EMPTY() {
			// condicion.availablePermits() <= 0;
			return procesosBloqueados <= 0;
		}
	}

	private Semaphore mutex;
	private SemaforoVC lector;
	private SemaforoVC escritor;
	private volatile int numeroLectores;
	private volatile boolean escritorEscribiendo;
	public volatile int VALOR;

	public SemaphoresExample() {
		inicializacion();
	}

	private void inicializacion() {
		mutex = new Semaphore(1, true);
		lector = new SemaforoVC(mutex);
		escritor = new SemaforoVC(mutex);
		numeroLectores = 0;
		escritorEscribiendo = false;
		VALOR = -1;
	}

	public void abrirLectura(StringBuilder buffer, int id) {
		try {
			mutex.acquire();
			if (escritorEscribiendo) {
				lector.DELAY();
			}
			numeroLectores++;
			buffer.append("Lector #" + id + " lee " + VALOR + ".\n");
			lector.RESUME();
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			mutex.release();
		}
	}

	public void cerrarLectura() {
		try {
			mutex.acquire();
			numeroLectores--;
			if (numeroLectores == 0) {
				escritor.RESUME();
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			mutex.release();
		}
	}

	public void abrirEscritura(StringBuilder buffer, int id) {
		try {
			mutex.acquire();
			if (numeroLectores <= 0 || escritorEscribiendo) {
				escritor.DELAY();
			}
			escritorEscribiendo = true;
			VALOR = id;
			buffer.append("Escritor escribe " + VALOR + ".\n");
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			mutex.release();
		}
	}

	public void cerrarEscritura() {
		try {
			mutex.acquire();
			escritorEscribiendo = false;
			if (lector.EMPTY()) {
				escritor.RESUME();
			} else {
				// desbloquear a un lector
				lector.RESUME();
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			mutex.release();
		}
	}
}
