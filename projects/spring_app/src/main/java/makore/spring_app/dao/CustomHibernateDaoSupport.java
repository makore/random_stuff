package makore.spring_app.dao;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.LockMode;
import org.hibernate.ScrollableResults;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Example;
import org.hibernate.criterion.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

public abstract class CustomHibernateDaoSupport<T> extends
		HibernateDaoSupport {
	private Class<T> persistentClass;

	@SuppressWarnings("unchecked")
	protected CustomHibernateDaoSupport() {
		this.persistentClass = (Class<T>) ((java.lang.reflect.ParameterizedType) getClass()
				.getGenericSuperclass()).getActualTypeArguments()[0];
	}

	@Autowired
	protected void init(SessionFactory factory) {
		super.setSessionFactory(factory);
	}

	protected Class<T> getPersistentClass() {
		return this.persistentClass;
	}

	protected void persist(T transientInstance) {
		getHibernateTemplate().persist(transientInstance);
	}

	protected void attachDirty(T instance) {
		getHibernateTemplate().saveOrUpdate(instance);
	}

	protected void attachClean(T instance) {
		getHibernateTemplate().lock(instance, LockMode.NONE);
	}

	protected void delete(T persistentInstance) {
		getHibernateTemplate().delete(persistentInstance);
	}

	protected T merge(T detachedInstance) {
		return getHibernateTemplate().merge(detachedInstance);
	}

	protected T findById(Serializable id) {
		return getHibernateTemplate().get(this.persistentClass, id);
	}

	protected List<T> findAll() {
		return getHibernateTemplate().loadAll(this.persistentClass);
	}

	@SuppressWarnings("unchecked")
	protected List<T> findByExample(T exampleInstance,
			String... excludeProperty) {
		final Criteria crit = getSession().createCriteria(getPersistentClass());
		final Example example = Example.create(exampleInstance);
		for (final String exclude : excludeProperty) {
			example.excludeProperty(exclude);
		}
		crit.add(example);
		return crit.list();
	}


	@SuppressWarnings("unchecked")
	protected List<T> findByExample(T exampleEntity, int firstResult,
			int maxResults) {
		return getHibernateTemplate().findByExample(exampleEntity, firstResult,
				maxResults);
	}

	@SuppressWarnings("unchecked")
	protected List<T> findAscOrdered(String orderColumn, int maxResults) {
		final Criteria crit = getSession().createCriteria(getPersistentClass());
		crit.addOrder(Order.asc(orderColumn)).setMaxResults(maxResults);
		return crit.list();
	}

	@SuppressWarnings("unchecked")
	protected List<T> findByCriteria(Criterion... criterion) {
		final Criteria crit = getSession().createCriteria(getPersistentClass());
		for (final Criterion c : criterion) {
			crit.add(c);
		}
		return crit.list();
	}

	/**
	 * Usage example:
	 * 
	 * <pre>
	 * {@code getHibernateTemplate().find("from Domain d where d.domainName = ?", domainName);}
	 * </pre>
	 */
	@SuppressWarnings("unchecked")
	protected List<T> find(String queryString, Object... values) {
		return getHibernateTemplate().find(queryString, values);
	}

	protected ScrollableResults getUserCursor() {
		return getSession().createQuery("from User u").setReadOnly(true)
				.setFetchSize(Integer.MIN_VALUE).setCacheable(false).scroll();
	}
}
