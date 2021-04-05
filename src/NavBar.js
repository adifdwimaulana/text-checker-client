import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
// eslint-disable-next-line
// eslint-disable-next-line
import "bootstrap/dist/css/bootstrap.min.css";

export default function NavBar() {
// eslint-disable-next-line
  const github="https://github.com/bonafideduck/react-highlight-within-textarea/"
// eslint-disable-next-line
  const npmjs="https://www.npmjs.com/package/react-highlight-within-textarea"
  
  return (
    <Navbar collapseOnSelect className="justify-content-between" expand="lg" bg="dark" variant="dark">
      <div>
        <Nav.Link href={npmjs}>
          <i className="fab fa-npm" style={{color: "white", fontSize: "2em"}} />
        </Nav.Link>
      </div>
      <div>
        <div  className="h2" style={{color: "white"}}>React Highlight Within Textarea</div>
      </div>
      <div>
        <Nav.Link href={github}>
          <i className="fab fa-github" style={{color: "white", fontSize: "2em"}} />
        </Nav.Link>
      </div>
    </Navbar>
  )
}
