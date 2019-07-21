import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';

const SERVER_URL = 'http://localhost:5000';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      response: null
    };
  }

  render() {
    const { error, isLoaded, response } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        [<img className="center-fit" src={`data:image/png;base64,${ response.image}`} />,
         <form onSubmit={this.sendLabel} noValidate>
           <label htmlFor="folder"></label>
           <input id="folder" type="text" name="folder" value={response.folder} hidden/>
           <label htmlFor="file"></label>
           <input type="text" name="file" value={response.file} hidden/>
           {response.options.labels.map(item => (
             [<input id={item} type="checkbox" name="label" key={item} value={item}/>,
              <label htmlFor={item}>{item}</label>,
              <br/>
             ]
           ))}
           <button>Submit</button>
         </form>
        ]
      );
    }
  }

  sendLabel(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    var url = SERVER_URL + '/classify?';

    var labels = [];
    for (var [key, value] of data.entries()) {
      if (key != 'label') {
        url = url + key + '=' + value + '&';
      } else {
        labels.push(value)
      }
    }

    url = url + '&label=' + labels;

    fetch(url, {
      method: 'GET'
    });

    window.location.reload();
  }

  componentDidMount() {
    fetch(SERVER_URL + '/get_image')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            response: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
}

export default App;
