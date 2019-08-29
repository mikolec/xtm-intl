import React, { Component } from "react";
import "./App.css";

const url_base = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json";

class App extends Component {
  state = {
    results: [],
    searchInput: "",
    searchText: "",
    replaceInput: ""
  };

  getResults = (str, limit = 10) => {
    var url = `${url_base}&srsearch="${str}"&srlimit=${limit}&origin=*`;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw new Error(response.status);
      })
      .then(response => response.json())
      .then(data => {
        // console.log(data.query.search);

        var results = data.query.search.map(({ snippet, title, pageid }) => ({ snippet, title, pageid }));

        this.setState({ results });
      })
      .catch(err => {
        console.log(err);
      });
  };

  replaceWith = str => {
    // console.log(this.state.searchText, "i");
    var regex = RegExp(this.state.searchText, "i");
    var firstIndex = this.state.results.findIndex(result => {
      return regex.test(result.snippet);
    });
    // console.log(firstIndex);
    if (firstIndex !== -1) {
      var newSnippet = this.state.results[firstIndex].snippet.replace(regex, str);
      console.log(newSnippet);

      var newResults = this.state.results.map((result, index) => {
        if (index === firstIndex) {
          result.snippet = newSnippet;
        }
        return result;
      });

      this.setState({ results: newResults });
    }
  };

  replaceAllWith = str => {
    var regex = RegExp(this.state.searchText, "ig");

    var newResults = this.state.results.map((result, index) => {
      // if (index === firstIndex) {
      //   result.snippet = newSnippet;
      // }
      result.snippet = result.snippet.replace(regex, str);

      return result;
    });

    this.setState({ results: newResults });
  };

  handleInputChange = e => {
    // console.log(e.target.name);
    // console.log(e.target.value);

    //e.target.value !== ""
    if (true) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  handleButtonClick = e => {
    var buttonName = e.target.name;
    switch (buttonName) {
      case "searchBtn":
        // console.log("search button clicked");
        this.getResults(this.state.searchInput);
        this.setState(prevState => {
          return {
            searchText: prevState.searchInput
            // searchInput: ""
          };
        });

        break;
      case "replaceBtn":
        // console.log("replace button clicked");
        this.replaceWith(this.state.replaceInput);
        break;
      case "replaceAllBtn":
        // console.log("replaceAll button clicked");
        this.replaceAllWith(this.state.replaceInput);
        break;
      default:
        console.log("unknown button clicked");
        break;
    }
  };

  render() {
    var { searchText, searchInput, replaceInput, results } = this.state;
    var Results = results.map(({ snippet, title, pageid }) => {
      // return <li key={pageid}>{snippet}</li>;
      return <li key={pageid} dangerouslySetInnerHTML={{ __html: snippet }}></li>;
    });
    return (
      <div className="wrapper">
        <div className="inputWrapper">
          <span>Search:</span>
          <input type="text" name="searchInput" onChange={this.handleInputChange} value={searchInput} />
          <button name="searchBtn" onClick={this.handleButtonClick}>
            Search
          </button>
        </div>
        <div className="inputWrapper">
          <span>Replace with:</span>
          <input type="text" name="replaceInput" onChange={this.handleInputChange} value={replaceInput} />
          <button name="replaceBtn" onClick={this.handleButtonClick}>
            Replace
          </button>
          <button name="replaceAllBtn" onClick={this.handleButtonClick}>
            Replace All
          </button>
        </div>

        <h2>
          Search results for: <em>{searchText}</em>
        </h2>

        <ul className="listWrapper">{Results}</ul>
      </div>
    );
  }
}

export default App;
