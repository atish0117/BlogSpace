import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67aee3d60011a35c860b');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const BLOG_DATABASE_ID = '67af5e8e000a6d18b2c5';
export const BLOGS_COLLECTION_ID = '67af5ed200234059c868';
export const USER_COLLECTION_ID = '67af5eab002c0c19bf53';