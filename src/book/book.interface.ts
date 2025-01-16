export interface IBook {
  id: number;
  title: string;
  author: string;
  description: string;
  publishedDate: Date;
  isbn: string;
  extra?: any;
}

export interface OpenLibraryResponse {
  identifiers: Identifiers;
  title: string;
  authors: KeyValue[];
  publish_date: string;
  publishers: string[];
  covers: number[];
  contributions: string[];
  languages: KeyValue[];
  source_records: string[];
  local_id: string[];
  type: KeyValue;
  first_sentence: TypeValuePair;
  key: string;
  number_of_pages: number;
  works: KeyValue[];
  classifications: Classifications;
  ocaid: string;
  isbn_10: string[];
  isbn_13: string[];
  latest_revision: number;
  revision: number;
  created: TypeValuePair;
  last_modified: TypeValuePair;
}

export interface KeyValue {
  key: string;
}

export interface Classifications {}

export interface TypeValuePair {
  type: string;
  value: string;
}

export interface Identifiers {
  goodreads: string[];
  librarything: string[];
}
