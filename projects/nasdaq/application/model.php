<?php

	class Model
	{
		private $collection;

		const DB_NAME = 'test';
		const DB_COLLECTION_NAME = 'users';

		private function init()
		{
			$mongo = new Mongo();
			$db = $mongo->selectDB(Model::DB_NAME);
			$this->collection = new MongoCollection($db, Model::DB_COLLECTION_NAME);
		}

		public function __construct()
		{
			$this->init();
		}

		public function get($user_email = '')
		{
			$array_cursor = array();
			if (empty($user_email))
			{
				$cursor = $this->collection->find();
				$array_cursor = iterator_to_array($cursor);
			}
			else
			{
				$cursor = $this->collection->find(array('email' => $user_email));
				$array_cursor = iterator_to_array($cursor);
			}
			return $array_cursor;
		}

		public function add($user_name = '', $user_email = '')
		{
			$this->collection->insert(array("username" => $user_name, "email" => $user_email, "timestamp" => "0"));
		}

		public function update_timestamp($user_email = '')
		{
			$str_time = strval(time());
			$this->collection->update(array('email' => $user_email), array('$set' => array('timestamp' => $str_time)));
		}

		public function delete($user_email = '')
		{
			$this->collection->remove(array("email" => $user_email));
		}
	}