import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'
import '../css/App.css';
import Home from './Home.js'
import Search from './Search.js'
import { getAll } from '../BooksApi.js';

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
        <div className='list-books-title'>
          <h1>My Reads</h1>
        </div>
            <Route exact path='/' render={props => (
              <Home books={this.state.books} changeShelf={ this.changeShelf }/>
            )} />
            <Route path='/search' render={props => (
              <Search />
            )} />
      </div>
    );
  }

  changeShelf(evt) {
    console.log(evt.target);
  }
}

export default App;
