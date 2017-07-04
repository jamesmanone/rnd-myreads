import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import '../css/App.css';
import { Home } from './Home.js'
import { Search } from './Search.js'
import { get, getAll, update } from '../BooksApi.js';

// Please note the changes I made to BooksApi.js for handling edge cases and errors.
// The api was somewhat error prone as written (example: a search for 'react' returned more
// than one entry with the same id)

export class App extends Component {

  state = {
    books: [],
    search: ''
  }

  componentDidMount() {
    getAll().then(books => this.setState({books:books}));
    this.setState({search: window.location.hash.split('#')[1]})

    // Event listener to sync url hash to state.query
    window.addEventListener('hashchange', evt => {
      this.setState({search: evt.newURL.split('#')[1]});
    });
  }

  render() {
    return (
      <div>
        <Route exact path='/' render={props => (
          <Home books={ this.state.books }
                changeShelf={ this.changeShelf }/>
        )} />
        <Route path='/search' render={ props => (
          <Search addBook={ this.addBook }
                  books={ this.state.books }
                  search={ this.state.search }
                  clearSearch={ this.clearSearch }/>
        )} />
      </div>
    );
  }

  // Handles changing shelf || adding book from search page
  addBook = evt => {
    const id = evt.target.id;
    const val = evt.target.value;
    update({id:id}, val)
    .then(() => {
      if(!this.state.books.filter(book => book.id === id).length) {
        get(id)
        .then(book => {
          this.setState(state => {
            let newBooks = state.books.concat(book)
            return {books: newBooks}
          })
        })
      } else {
        this.setState(state => {
          return {books: state.books.map(book => {
            book.shelf = book.id === id ? val : book.shelf;
            return book;
          })};
        });
      }
    });
  }

  changeShelf = evt => {
    let id = evt.target.id;
    let val = evt.target.value;
    update({id:id}, val)
    .then(() => this.setState(state => {
      return {books: state.books.map(book => {
        book.shelf = book.id === id ? val : book.shelf;
        return book;
      })};
    }));
  }

  clearSearch = () => {
    this.setState({search: ''});
  }
}
