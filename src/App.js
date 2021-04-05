import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { HighlightWithinTextarea }  from 'react-highlight-within-textarea'
import axios from 'axios'
import $ from 'jquery'

import NavBar from './NavBar.js'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function ToolTip(props) {
  const content = (
    <div style={{
      whiteSpace: "pre", 
      overflow: "hidden", 
      textOverflow: "ellipsis"
    }}>
      {JSON.stringify(props.data, 0, 1)}
    </div>
  )
  const overlayStyle = {
    position: "absolute",
    height: "50%",
    width: "100%",
    background: "transparent",
    zIndex: 1,
  }

  return (
    <mark style={{position: "relative"}}>
      <Tippy content={content} maxWidth="400px">
        <mark style={overlayStyle}></mark>
      </Tippy>
      <props.MarkView />
    </mark>
  )
}


function MultiColor(props) {
  const [color, setColor] = useState(0xff8800);
  const colorText = `#${color.toString(16)}`

  useEffect(() => {
    const timer = setInterval(() => setColor(0x808080 | (color + 0x081018) % 0xFFFFFF), 200)
    return () => clearInterval(timer)
  })
  return <props.MarkView style={{backgroundColor: colorText}} />
}

let data = [[
  "Text Checker",
  "This text checker was built on Node.js, MongoDB, and React",
  "",
  [ 'orange', /ba(na)*/gi, [0, 5] ]
]];


const crToBR = (text) => {
  let split = text.split("\n");
  let arr = [];

  for (const index in split) {
    arr.push(<span key={index}>{split[index]}</span>);
    arr.push(<br key={"b" + index} />);
  }
  arr.pop();
  return arr;
}

const Example = ({title, text, initialValue}) => {
  const [value, setValue] = useState(initialValue)
  const [highlight, setHighlight] = useState([])
  const [order, setOrder] = useState([])

  const handleChange = (e) => {
    const value = e.target.value
    setValue(value)

    let body = []
    let orders = []
    let split = value.split(" ")
    
    let startIndex = 0
    split.forEach((result, index) => {
      let start = value.indexOf(result, startIndex)
      let end = result.length > 0 ? parseInt(start) + result.length : 0
      
      body.push(result.replace(/[!@#$%^&*.,;]$/g, ""))
      orders.push({
        name: result,
        order: [start, end]
      })
      startIndex = end
    })

    setOrder(orders)
    
    // Fetch and Highlighting
    fetchHighlight(body)
  }

  const fetchHighlight = (body) => {
    axios({
      method: 'POST',
      url: 'http://localhost:8000/api/word/highlight',
      data: { input: body }
    })
    .then((response) => {
      if(response.status === 200){
        if(response.data.status === 200){
          let highlights = []

          order.forEach((p, pIndex) => {
            response.data.result.forEach((q, qIndex) => {
              if(p.name === q){
                highlights.push([p.order])
              }
            })
          })

          setHighlight(highlights)
        }
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const fetchSuggestion = (body) => {

  }

  return (
    <Row>
      <Col>
        <h2>{title}</h2>
        <p>{text}</p>
        <HighlightWithinTextarea
          value={value}
          highlight={highlight}
          onChange= {handleChange}
          onPaste={handleChange}
          rows="4"
          containerStyle={{width: "100%"}}
          style={{width: "100%"}}
        />
        {/* <pre>
          function Demo() {"{"}<br />
          {"  "}const highlight = {crToBR(highlightText)};<br /><br />
          {"  "}{"return <HighlightWithinTextarea highlight={highlight} />;"}<br />
          {"}"}
        </pre> */}
      </Col>
  </Row>
  )
}

const App = () => {
  return (
    <div style={{background: "gray"}}>
    <Container style={{background: "white", maxWidth: 800, padding: 20, border: "solid 20px gray", margin: 'auto'}}>
      <NavBar />
      <br />
      {
        data.map( (d) =>
          <Example
            key={d[0]}
            title={d[0]}
            text={d[1]}
            initialValue={d[2]}
          />
        )
      }
    </Container>
    </div>
  )
}

export default App
