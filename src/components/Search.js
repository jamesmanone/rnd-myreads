import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../BooksApi.js'
import { Book } from './Book.js'

export class Search extends Component {

  state = {
    q:'',
    results: []
  }

  // Stores timeout for automatic update of hash if form is not submitted
  clock = false;

  // Search for previous on browser back
  componentDidMount() {
    // setState and populate state.results when App passes in props.search. Not sure this ever gets called
    this.props.search && this.setState({q: this.props.search}, () => {
      this.state.q && this.search();
    });

    // setState and populate state.results when no props.search, but something present in hash
    !this.props.search && window.location.hash && this.setState({q: window.location.hash.split('#')[1].replace('+', ' ')}, () => {
      this.state.q && this.search();
    });
  }

  componentWillReceiveProps(newProps) {
    if(newProps.search && this.state.q !== newProps.search) {
      this.setState({q: newProps.search}, () => {
        this.state.q && this.search();
      });
    }
  }

  componentWillUnmount() {
    this.props.clearSearch();
  }

  render() {
    return (
      <div>
        <div className='search-books-bar'>
          <Link className='close-search'
                to='/'>
          </Link>
          <form onSubmit={ this.updateHash }>
            <input value={ this.state.q }
                   onChange={ this.enterSearch }
                   placeholder='Search Books'
                   type='text' />
          </form>
        </div>
        <div className='search-books-results'>
          <h1>{ this.state.error }</h1>
          <Book books={ this.state.results }
                changeShelf={ this.props.addBook }/>
        </div>
      </div>
    );
  }

  enterSearch = evt => {
    // clearTimeout so hash is not updated while typing
    clearTimeout(this.clock);
    this.setState({q: evt.target.value}, this.search);
  }

  updateHash = evt => {
    evt && evt.preventDefault();
    clearTimeout(this.clock);
    if(window.location.hash.split('#')[1] !== this.state.q.trim()) {
      window.history.pushState(null, null, `#${this.state.q.trim().replace(' ', '+')}`);
    }
  }

  search = () => {
    // Kill if empty query
    if(!this.state.q.trim()) {
      this.setState({results: []});
      return;
    }
    this.state.q && search(this.state.q.trim(), 20)
    .then(res => {
      // If BooksApi returns anything other than array throw error and skip state updates
      if(!Array.isArray(res)) {
        throw new Error('Bad response');
      }
      return res;
    })
    .then(res =>
      res.map(newBook => {
        if(this.props.books.filter(book => book.id === newBook.id).length) {  // Sync result shelf with bookshelves if present
          newBook.shelf = this.props.books.filter(book => book.id === newBook.id)[0].shelf;
        } else if(newBook.shelf !== 'none') {  // Book is not on shelf but came with a shelf.
          newBook.shelf = 'none';  // Remove it.
        }
        return newBook;
      }))
    .then(res => {
      this.setState({results: res, error: ''});  // Add books to results array and clear any error messages
      this.clock = window.setTimeout(this.updateHash, 5000)
    })
    .catch(e => {
      console.log(e);
      this.setState({error: 'Failed to load resources'})
    })
  }
}
