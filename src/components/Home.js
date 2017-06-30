import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Book } from './Book';

class Home extends Component {

  render() {
    return (
      <div>
        <div className='list-books-title'>
          <h1>My Reads</h1>
        </div>
        <div className='list-books-content'>
          <div className='bookshelf'>
            <div className='bookshelf-books'>
              <h2>Currently Reading</h2>
              <Book books={ this.props.books.filter(book => book.shelf === 'currentlyReading') }
                    changeShelf={ this.props.changeShelf }
              />
            </div>
            <div className='bookshelf-books'>
              <h2>Want to Read</h2>
              <Book books={ this.props.books.filter(book => book.shelf === 'wantToRead') }
                    changeShelf={ this.props.changeShelf }
              />
            </div>
            <div className='bookshelf-books'>
              <h2>Read</h2>
              <Book books={ this.props.books.filter(book => book.shelf === 'read') }
                    changeShelf={ this.props.changeShelf }
              />
            </div>
            <div className='open-search'>
              <Link to='/search'></Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
