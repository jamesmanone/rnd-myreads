import React from 'react';

export function Book(props) {
  return (
    <ul className='books-grid'>
      {( props.books && props.books.map(book => (
        <li className='book' key={ book.id }>
          <div className='book-top'>
            <img src={ book.imageLinks && book.imageLinks.thumbnail }
                 alt={ book.title ? book.title : null }
            />
            <span className='book-shelf-changer'>
              <select id={ book.id }
                      defaultValue={ book.shelf ? book.shelf : null }
                      onChange={ props.changeShelf }>
                <option value='none'>Remove</option>
                <option value='wantToRead'>Want to Read</option>
                <option value='currentlyReading'>Currently Reading</option>
                <option value='read'>Read</option>
              </select><br />
            </span>
          </div>
          <span className='book-title'>{ book.title ? book.title : null }</span><br />
          <span className='book-authors'>{ book.authors && book.authors.length ? book.authors.map((author, index) => (
            <span key={ index }>{ author }<br /></span>
          )) : null }</span>
        </li>
      ))
    )}
    </ul>
  );
}
