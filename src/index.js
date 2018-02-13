import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'
import io from 'socket.io-client'

class ReactApp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      msg:"this is app",
      socket: io()
    }
  }

  getData(e){
    e.preventDefault()
    request.get('/getmsg')
           .query({
             msg:this.state.msg
           })
           .end((err,data) => {
             //when the response is sent through 
             this.setState({msg:data.body.servermsg})
             console.log(data.body.servermsg)
           })
  }

  getDataSkt(e){
    e.preventDefault()
    this.state.socket.emit('getmsg', this.state.msg)
  }

  render(){
    this.state.socket.on('answer', (data) => {
      console.log(data)
      this.setState({msg:data})
    })
    const getData = e => this.getData(e)
    const getDataSkt = e => this.getDataSkt(e)
    const response = (
        <div>
          <button onClick={getData}> ask server via http req / response by json</button> <br />
          <button onClick={getDataSkt}> ask server via socket req / response by socket</button>
          server says, {this.state.msg}
        </div>
    )
    return response
  }
}

ReactDOM.render(<ReactApp />,document.getElementById('root'))