import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../BooksApi.js'
import { Book } from './Book.js'

export class Search extends Component {
  state = {
    q:'',
    results: []
  }

  // This will set state.q to match url search param on browser back event
  componentWillMount() {
    this.props.search && this.setState({q: this.props.search})
  }

  // Search for previous on browser back
  componentDidMount() {
    this.state.q && this.search();  // Short circuit if
  }

  componentWillReceiveProps(newProps) {
    if(newProps.search && this.state.q !== newProps.search) {
      this.setState({q: newProps.search});
      // setTimeout because setstate is not always instantanious
      setTimeout(() => {
        this.state.q && this.search();
      }, 10)
    }
  }

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
                   placeholder='Search Books'
                   type='text' />
          </form>
        </div>
        <div>
          <h1>{ this.state.error }</h1>
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
    evt && evt.preventDefault(); // Short circuit to prevent when called from component did mount
    search(this.state.q, 20)
    .then(res => {
      if(!res.map) {
        throw new Error('Bad response');
      }
      return res;
    })
    .then(res =>
      res.map(newBook => {
        if(this.props.books.filter(book => book.id === newBook.id).length) {
          newBook.shelf = this.props.books.filter(book => book.id === newBook.id)[0].shelf;
        }
        return newBook;
      }))
    .catch(e => {
      console.log(e);
      this.setState({error: 'Failed to load resources'})
    })
    .then(res => {
      this.setState({results: res});
      evt && window.history.pushState(null, null, `#${this.state.q}`);
    })
  }
}
