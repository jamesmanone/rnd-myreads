import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../BooksApi.js'
import { Book } from './Book.js'

class Search extends Component {
  state = {q:'', results:[]}

  render() {
    return (
      <div>
        <div className='search-books-bar'>
          <Link className='close-search'
                to='/'>
          </Link>
          <form onSubmit={ this.search }>
            <input value={ this.state.q }
                   onChange={ this.enterSearch }
                   placeholder='Search Books' />
          </form>
        </div>
        <div className='search-books-results'>
          <Book books={ this.state.results }
                changeShelf={ this.props.addBook }/>
        </div>
      </div>
    );
  }

  enterSearch = evt => {
    this.setState({q: evt.target.value});
  }

  search = evt => {
    evt.preventDefault();
    search(this.state.q, 20)
    .then(res => {
      this.setState({results: res})
    })
  }
}

export default Search;
