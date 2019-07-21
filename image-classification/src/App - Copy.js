import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';


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
           <button>Abschicken</button>
         </form>
        ]
      );
    }
  }

  sendLabel(event) {
    event.preventDefault();
    console.log(event);
    console.log(event.target);
    console.log('1')
    const data = new FormData(event.target);
    var url = 'http://localhost:5000/classify';
    console.log(data);
    fetch('http://localhost:5000/classify', {
      method: 'GET'
    });
  }

  componentDidMount() {
    fetch("http://localhost:5000/get_image")
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
