import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import '../css/App.css';
import Home from './Home.js'
import Search from './Search.js'
import { get, getAll, update } from '../BooksApi.js';

class App extends Component {

  state = {
    books: []
  }

  componentDidMount() {
    getAll().then(books => this.setState({books:books}));
  }

  render() {
    return (
      <div>
        <Route exact path='/' render={props => (
          <Home books={this.state.books} changeShelf={ this.changeShelf }/>
        )} />
        <Route path='/search' render={props => (
          <Search addBook={ this.addBook }
                  books={ this.state.books }/>
        )} />
      </div>
    );
  }

  addBook = evt => {
    const id = evt.target.id;
    const val = evt.target.value;
    update({id: id}, val)
      .then(res => {
        get(id)
          .then(res => {
            if(!this.state.books.filter(book => book.id = id).length) {
              this.setState(state => {
                console.log(state.books);
                return {books: state.books.concat(res)}
              });
            } else {
              this.setState(state => {
                state.books.forEach(book => {
                  if(book.id === id) {
                    book.shelf = val;
                  };
                })
              });
            }
          });
      });
  }

  changeShelf = evt => {
    let id = evt.target.id;
    let val = evt.target.value
    update({id: id}, val)
      .then(res => this.setState(state => {
        state.books.forEach(book => {
          if(book.id === id) {
            book.shelf = val;
          };
      });
    }))
  }
}

export default App;
