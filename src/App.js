import './App.css';
import React, { useState } from 'react';

function Header (props) {
  return (
    <header>
      <h1><a href='/' onClick={(e) => {
        e.preventDefault();
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  );
}

function Nav (props) {
  console.log(props.topics);
  const lis = [];
  for (let i=0; i<props.topics.length; i++) {
    const topic = props.topics[i]
    lis.push(<li key={topic.id}>
      <a href={'/read/'+topic.id} id={topic.id} onClick={(e) => {
        e.preventDefault();
        props.onChangeMode(Number(e.target.id));
      }}>{topic.title}</a>
    </li>)
  }
  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  );
}

function Article (props) {
  return(
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}


function Create (props) {
  return(
    <article>
      <h2>Create</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const body = e.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type='text' name='title' placeholder='title' /></p>
        <p><textarea name='body' placeholder='body' /></p>
        <p><input type='submit' value='Create' /></p>
      </form>
    </article>
  );
}

function Update (props) {
  const [ title, setTitle ] = useState(props.title);
  const [ body, setBody ] = useState(props.body); 
  return(
    <article>
      <h2>Update</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const body = e.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type='text' name='title' placeholder='title' value={title} onChange={(e) => {
          setTitle(e.target.value)
        }}/></p>
        <p><textarea name='body' placeholder='body' value={body} onChange={e => {
          setBody(e.target.value)
        }}/></p>
        <p><input type='submit' value='Update' /></p>
      </form>
    </article>
  );
}

function App() {
  const [ mode, setMode ] = useState('WELCOME');
  const [ id, setId ] = useState(null);
  const [ nextId, setNextId ] = useState(4);
  const [ topics, setTopics ] = useState([
    {id: 1, title: 'html', body: 'html is...'},
    {id: 2, title: 'css', body: 'css is...'},
    {id: 3, title: 'js', body: 'js is...'}
  ]);

  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME') {
    content = <Article title='Welcome' body='Hello, WEB'/>
  } else if (mode === 'READ') {
    let title, body = null;
    topics.map(topic => {
      // console.log(typeof id)
      if(topic.id === id) {
        title = topic.title;
        body = topic.body;
      }
    })
    content = <Article title={title} body={body}/>
    contextControl = <>
        <li><a href={'/update'+id} onClick={e=> {
        e.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type='button' value='Delete' onClick={() => {
        setTopics(topics.filter(item => item.id !== id));
        setMode('WELCOME')
      }}/></li>
    </>
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(title, body)=>{
      const newTopic = {id: nextId, title: title,  body: body}
      // setTopics([...topics, newTopic]);
      setTopics(topics.concat(newTopic));
      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1);
    }} />
  } else if (mode === 'UPDATE') {
    let title, body = null;
    topics.map(topic => {
      if(topic.id == id) {
        title = topic.title;
        body = topic.body;
      }
    })
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      console.log(title, body);
      const newTopics = [...topics];
      const updatedTopic = {id: id, title: title, body: body}
      for(let i = 0; i < newTopics.length; i++) {
        if (newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}/>
  }

  return (
  <div>
    <Header title="WEB" onChangeMode={() => {
      setMode('WELCOME');
    }} />
    <Nav topics={topics} onChangeMode={(_id) => {
      setMode('READ');
      setId(_id);
    }}/>
    {content}
    <ul>
      <li>
        <a href='/create' onClick={(e) => {
          e.preventDefault();
          setMode('CREATE')
        }}>Create</a>
      </li>
      {contextControl}
    </ul>
  </div>
  );
}

export default App;
