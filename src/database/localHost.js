import express from 'express';
import PouchDB from 'pouchdb';
import path from 'path';
import PouchDBFind from 'pouchdb-find'; 

PouchDB.plugin(PouchDBFind); // Use the plugin
const __dirname = path.dirname(new URL(import.meta.url).pathname);
// Define the new directory path
const dbPath = path.join(__dirname, './pouchDB/lexiconDB');

let dbInstance = null;

function getDBInstance() {
  if (!dbInstance) {
    dbInstance = new PouchDB(dbPath);
    console.log('PouchDB instance created');
  } else {
    console.log('Using existing PouchDB instance');
  }
  return dbInstance;
}

export const db = getDBInstance();
