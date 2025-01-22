export type Barcode = {
  code: string
  bookMeta?: IsbnBookMeta
}

export type IsbnBookMeta ={
  bib_key : string,
  info_url: string
  preview_url : string
  thumbnail_url : string
  details: {
    title: string,
    publishers : string[],
    publish_date: string
  }
}
